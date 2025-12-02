import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { stamp_card_id, business_id } = await req.json();

    if (!stamp_card_id || !business_id) {
      return new Response(
        JSON.stringify({ error: 'Missing stamp_card_id or business_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating redemption code for user ${user.id}, stamp_card: ${stamp_card_id}, business: ${business_id}`);

    // Check if stamp card is completed and belongs to user
    const { data: stampCard, error: stampCardError } = await supabase
      .from('stamp_cards')
      .select('id, is_completed, customer_id')
      .eq('id', stamp_card_id)
      .eq('customer_id', user.id)
      .single();

    if (stampCardError || !stampCard) {
      console.error('Stamp card error:', stampCardError);
      return new Response(
        JSON.stringify({ error: 'Stamp card not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!stampCard.is_completed) {
      return new Response(
        JSON.stringify({ error: 'Stamp card not completed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for existing active or redeemed codes
    const { data: existingCodes } = await supabase
      .from('rewards_redeemed')
      .select('id, is_redeemed, code_expires_at, qr_expires_at, pin_expires_at')
      .eq('stamp_card_id', stamp_card_id)
      .eq('customer_id', user.id);

    const now = new Date();
    const hasRedeemed = existingCodes?.some(c => c.is_redeemed);
    const hasActiveCode = existingCodes?.some(c => {
      if (c.is_redeemed) return false;
      const qrExpiry = c.qr_expires_at ? new Date(c.qr_expires_at) : null;
      const pinExpiry = c.pin_expires_at ? new Date(c.pin_expires_at) : null;
      return (qrExpiry && qrExpiry > now) || (pinExpiry && pinExpiry > now);
    });

    if (hasRedeemed) {
      return new Response(
        JSON.stringify({ error: 'Reward already redeemed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get loyalty program settings
    const { data: loyaltyProgram } = await supabase
      .from('loyalty_programs')
      .select('qr_expiry_seconds, pin_expiry_seconds, redemption_mode')
      .eq('business_id', business_id)
      .single();

    const qrExpirySeconds = loyaltyProgram?.qr_expiry_seconds || 30;
    const pinExpirySeconds = loyaltyProgram?.pin_expiry_seconds || 120;
    const redemptionMode = loyaltyProgram?.redemption_mode || 'both';

    // Generate secure QR token (UUID-based for uniqueness)
    const qrToken = crypto.randomUUID();
    
    // Generate 4-digit PIN
    const pinCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Generate legacy 6-digit code for backward compatibility
    const redemptionCode = Math.floor(100000 + Math.random() * 900000).toString();

    const qrExpiresAt = new Date(now.getTime() + qrExpirySeconds * 1000);
    const pinExpiresAt = new Date(now.getTime() + pinExpirySeconds * 1000);
    const codeExpiresAt = new Date(now.getTime() + Math.max(qrExpirySeconds, pinExpirySeconds) * 1000);

    // Check if we should update existing record or create new one
    const existingPendingCode = existingCodes?.find(c => !c.is_redeemed);

    let redemptionId: string;
    
    if (existingPendingCode) {
      // Update existing record with new codes
      const { data: updated, error: updateError } = await supabase
        .from('rewards_redeemed')
        .update({
          qr_token: qrToken,
          pin_code: pinCode,
          redemption_code: redemptionCode,
          qr_expires_at: qrExpiresAt.toISOString(),
          pin_expires_at: pinExpiresAt.toISOString(),
          code_expires_at: codeExpiresAt.toISOString(),
          code_generated_at: now.toISOString(),
          failed_attempts: 0,
          lockout_until: null,
        })
        .eq('id', existingPendingCode.id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }
      redemptionId = updated.id;
    } else {
      // Create new record
      const { data: inserted, error: insertError } = await supabase
        .from('rewards_redeemed')
        .insert({
          customer_id: user.id,
          business_id: business_id,
          stamp_card_id: stamp_card_id,
          qr_token: qrToken,
          pin_code: pinCode,
          redemption_code: redemptionCode,
          qr_expires_at: qrExpiresAt.toISOString(),
          pin_expires_at: pinExpiresAt.toISOString(),
          code_expires_at: codeExpiresAt.toISOString(),
          code_generated_at: now.toISOString(),
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }
      redemptionId = inserted.id;
    }

    console.log(`Generated codes - QR: ${qrToken.slice(0, 8)}..., PIN: ${pinCode}, ID: ${redemptionId}`);

    return new Response(
      JSON.stringify({
        success: true,
        redemption_id: redemptionId,
        qr_token: qrToken,
        pin_code: pinCode,
        redemption_code: redemptionCode,
        qr_expires_at: qrExpiresAt.toISOString(),
        pin_expires_at: pinExpiresAt.toISOString(),
        redemption_mode: redemptionMode,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error generating redemption code:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to generate redemption code', details: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

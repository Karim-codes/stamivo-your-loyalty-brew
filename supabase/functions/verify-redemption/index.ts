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

    // Get user from auth header (business owner)
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

    const { verification_type, code } = await req.json();

    if (!verification_type || !code) {
      return new Response(
        JSON.stringify({ error: 'Missing verification_type or code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying redemption - type: ${verification_type}, code: ${code.slice(0, 8)}...`);

    // Get business owned by this user
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (businessError || !business) {
      console.error('Business error:', businessError);
      return new Response(
        JSON.stringify({ error: 'Business not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get loyalty program settings
    const { data: loyaltyProgram } = await supabase
      .from('loyalty_programs')
      .select('redemption_mode, max_failed_attempts, lockout_duration_minutes')
      .eq('business_id', business.id)
      .single();

    const redemptionMode = loyaltyProgram?.redemption_mode || 'both';
    const maxFailedAttempts = loyaltyProgram?.max_failed_attempts || 5;
    const lockoutDurationMinutes = loyaltyProgram?.lockout_duration_minutes || 15;

    // Validate verification type against business settings
    if (redemptionMode === 'qr_only' && verification_type === 'pin') {
      return new Response(
        JSON.stringify({ error: 'PIN verification not enabled for this business' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (redemptionMode === 'pin_only' && verification_type === 'qr') {
      return new Response(
        JSON.stringify({ error: 'QR verification not enabled for this business' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Search for redemption based on verification type
    let redemptionQuery = supabase
      .from('rewards_redeemed')
      .select(`
        id,
        is_redeemed,
        qr_token,
        pin_code,
        redemption_code,
        qr_expires_at,
        pin_expires_at,
        code_expires_at,
        failed_attempts,
        lockout_until,
        customer_id,
        stamp_card_id
      `)
      .eq('business_id', business.id)
      .eq('is_redeemed', false);

    if (verification_type === 'qr') {
      redemptionQuery = redemptionQuery.eq('qr_token', code);
    } else if (verification_type === 'pin') {
      redemptionQuery = redemptionQuery.eq('pin_code', code);
    } else {
      // Legacy 6-digit code
      redemptionQuery = redemptionQuery.eq('redemption_code', code);
    }

    const { data: redemption, error: redemptionError } = await redemptionQuery.maybeSingle();

    if (redemptionError) {
      console.error('Redemption query error:', redemptionError);
      throw redemptionError;
    }

    if (!redemption) {
      // Track failed attempt (find any pending redemption for this business)
      const { data: anyPending } = await supabase
        .from('rewards_redeemed')
        .select('id, failed_attempts')
        .eq('business_id', business.id)
        .eq('is_redeemed', false)
        .limit(1)
        .maybeSingle();

      if (anyPending) {
        await supabase
          .from('rewards_redeemed')
          .update({
            failed_attempts: (anyPending.failed_attempts || 0) + 1,
            last_failed_at: new Date().toISOString(),
          })
          .eq('id', anyPending.id);
      }

      return new Response(
        JSON.stringify({ error: 'Invalid code', code: 'INVALID_CODE' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();

    // Check lockout
    if (redemption.lockout_until && new Date(redemption.lockout_until) > now) {
      const lockoutRemaining = Math.ceil((new Date(redemption.lockout_until).getTime() - now.getTime()) / 60000);
      return new Response(
        JSON.stringify({ 
          error: `Too many failed attempts. Try again in ${lockoutRemaining} minutes.`,
          code: 'LOCKED_OUT',
          lockout_remaining_minutes: lockoutRemaining
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check expiry based on verification type
    let isExpired = false;
    if (verification_type === 'qr' && redemption.qr_expires_at) {
      isExpired = new Date(redemption.qr_expires_at) < now;
    } else if (verification_type === 'pin' && redemption.pin_expires_at) {
      isExpired = new Date(redemption.pin_expires_at) < now;
    } else if (redemption.code_expires_at) {
      isExpired = new Date(redemption.code_expires_at) < now;
    }

    if (isExpired) {
      return new Response(
        JSON.stringify({ error: 'Code has expired', code: 'CODE_EXPIRED' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check failed attempts threshold
    if ((redemption.failed_attempts || 0) >= maxFailedAttempts) {
      // Apply lockout
      const lockoutUntil = new Date(now.getTime() + lockoutDurationMinutes * 60000);
      await supabase
        .from('rewards_redeemed')
        .update({
          lockout_until: lockoutUntil.toISOString(),
          failed_attempts: 0,
        })
        .eq('id', redemption.id);

      return new Response(
        JSON.stringify({ 
          error: `Too many failed attempts. Locked out for ${lockoutDurationMinutes} minutes.`,
          code: 'LOCKED_OUT',
          lockout_remaining_minutes: lockoutDurationMinutes
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get customer info
    const { data: customer } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', redemption.customer_id)
      .single();

    // Get stamp card and loyalty program info
    const { data: stampCard } = await supabase
      .from('stamp_cards')
      .select('stamps_collected')
      .eq('id', redemption.stamp_card_id)
      .single();

    const { data: program } = await supabase
      .from('loyalty_programs')
      .select('reward_description, stamps_required')
      .eq('business_id', business.id)
      .single();

    // Mark as redeemed
    const { error: updateError } = await supabase
      .from('rewards_redeemed')
      .update({
        is_redeemed: true,
        redeemed_at: now.toISOString(),
        verified_by: user.id,
        failed_attempts: 0,
        lockout_until: null,
      })
      .eq('id', redemption.id);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    console.log(`Redemption verified successfully - ID: ${redemption.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        redemption_id: redemption.id,
        customer: {
          full_name: customer?.full_name || 'Unknown',
          email: customer?.email || null,
        },
        reward: {
          description: program?.reward_description || 'Free item',
          stamps_collected: stampCard?.stamps_collected || 0,
          stamps_required: program?.stamps_required || 10,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error verifying redemption:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to verify redemption', details: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

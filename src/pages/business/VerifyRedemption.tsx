import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, XCircle, Search, Gift, AlertCircle, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RedemptionDetails {
  id: string;
  redemption_code: string;
  code_expires_at: string;
  is_redeemed: boolean;
  redeemed_at: string | null;
  customer: {
    full_name: string | null;
    email: string | null;
  };
  stamp_card: {
    stamps_collected: number;
  };
  loyalty_program: {
    reward_description: string;
    stamps_required: number;
  };
}

export default function VerifyRedemption() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [redemption, setRedemption] = useState<RedemptionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const searchCode = async () => {
    if (!user || !code.trim()) return;

    setSearching(true);
    setError(null);
    setRedemption(null);

    try {
      // Get business ID
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (businessError) throw businessError;

      // Search for redemption code
      const { data: redemptionData, error: redemptionError } = await supabase
        .from('rewards_redeemed')
        .select(`
          id,
          redemption_code,
          code_expires_at,
          is_redeemed,
          redeemed_at,
          customer_id,
          stamp_card_id
        `)
        .eq('business_id', businessData.id)
        .eq('redemption_code', code.trim())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (redemptionError) {
        console.error("Error fetching redemption:", redemptionError);
        throw redemptionError;
      }

      if (!redemptionData) {
        setError("Code not found. Please check the code and try again.");
        return;
      }

      // Get customer profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', redemptionData.customer_id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      // Get stamp card details
      const { data: stampCardData, error: stampCardError } = await supabase
        .from('stamp_cards')
        .select('stamps_collected')
        .eq('id', redemptionData.stamp_card_id)
        .single();

      if (stampCardError) {
        console.error("Error fetching stamp card:", stampCardError);
        throw stampCardError;
      }

      // Get loyalty program details
      const { data: programData, error: programError } = await supabase
        .from('loyalty_programs')
        .select('reward_description, stamps_required')
        .eq('business_id', businessData.id)
        .single();

      if (programError) {
        console.error("Error fetching loyalty program:", programError);
        throw programError;
      }

      setRedemption({
        id: redemptionData.id,
        redemption_code: redemptionData.redemption_code,
        code_expires_at: redemptionData.code_expires_at,
        is_redeemed: redemptionData.is_redeemed,
        redeemed_at: redemptionData.redeemed_at,
        customer: profileData || { full_name: null, email: null },
        stamp_card: stampCardData,
        loyalty_program: programData
      });
    } catch (error: any) {
      console.error("Error searching code:", error);
      setError("Failed to search code. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const verifyRedemption = async () => {
    if (!redemption || !user) return;

    setVerifying(true);

    try {
      const { error } = await supabase
        .from('rewards_redeemed')
        .update({
          is_redeemed: true,
          redeemed_at: new Date().toISOString(),
          verified_by: user.id
        })
        .eq('id', redemption.id);

      if (error) throw error;

      // Trigger haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      // Show success dialog
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Error verifying redemption:", error);
      toast.error("Failed to verify redemption");
    } finally {
      setVerifying(false);
    }
  };

  const isCodeExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const canRedeem = redemption && !redemption.is_redeemed && !isCodeExpired(redemption.code_expires_at);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          onClick={() => navigate("/business/dashboard")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Verify Redemption</h1>
          <p className="text-muted-foreground">
            Enter the customer's redemption code to verify their reward
          </p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Redemption Code
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-2xl font-mono text-center tracking-widest"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      searchCode();
                    }
                  }}
                />
                <Button
                  onClick={searchCode}
                  disabled={searching || code.length !== 6}
                  size="lg"
                >
                  {searching ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Redemption Details */}
        {redemption && (
          <Card className="p-6">
            <div className="space-y-6">
              {/* Status Header */}
              <div className="text-center pb-4 border-b">
                {redemption.is_redeemed ? (
                  <div className="flex items-center justify-center gap-2 text-success">
                    <CheckCircle2 className="w-8 h-8" />
                    <div>
                      <p className="text-xl font-bold">Already Redeemed</p>
                      <p className="text-sm text-muted-foreground">
                        {redemption.redeemed_at && format(new Date(redemption.redeemed_at), 'PPp')}
                      </p>
                    </div>
                  </div>
                ) : isCodeExpired(redemption.code_expires_at) ? (
                  <div className="flex items-center justify-center gap-2 text-destructive">
                    <XCircle className="w-8 h-8" />
                    <div>
                      <p className="text-xl font-bold">Code Expired</p>
                      <p className="text-sm text-muted-foreground">
                        Expired {format(new Date(redemption.code_expires_at), 'PPp')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Gift className="w-8 h-8" />
                    <div>
                      <p className="text-xl font-bold">Valid Code</p>
                      <p className="text-sm text-muted-foreground">
                        Expires {format(new Date(redemption.code_expires_at), 'p')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer</h3>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="font-semibold">{redemption.customer.full_name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{redemption.customer.email}</p>
                </div>
              </div>

              {/* Reward Details */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Reward</h3>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="font-semibold">{redemption.loyalty_program.reward_description}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {redemption.stamp_card.stamps_collected}/{redemption.loyalty_program.stamps_required} stamps completed
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {canRedeem && (
                <Button
                  onClick={verifyRedemption}
                  disabled={verifying}
                  className="w-full"
                  size="lg"
                >
                  {verifying ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Verify & Redeem Reward
                    </span>
                  )}
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Help Text */}
        <Card className="p-4 mt-6 bg-muted/50">
          <p className="text-sm text-muted-foreground text-center">
            💡 Ask the customer to show you their redemption code from their app
          </p>
        </Card>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
              <PartyPopper className="w-10 h-10 text-success" />
            </div>
            <AlertDialogTitle className="text-2xl text-center">
              Reward Redeemed Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              The customer's reward has been verified and redeemed.
              <br />
              <span className="text-success font-medium">
                Customer has been notified
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              onClick={() => {
                setShowSuccessDialog(false);
                setCode("");
                setRedemption(null);
              }}
              className="w-full"
              size="lg"
            >
              Done
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

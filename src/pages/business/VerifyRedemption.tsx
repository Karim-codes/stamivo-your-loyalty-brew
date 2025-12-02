import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle2, XCircle, Gift, AlertCircle, PartyPopper, QrCode, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QRScanner } from "@/components/QRScanner";

interface VerificationResult {
  success: boolean;
  redemption_id: string;
  customer: {
    full_name: string;
    email: string | null;
  };
  reward: {
    description: string;
    stamps_collected: number;
    stamps_required: number;
  };
}

export default function VerifyRedemption() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pinCode, setPinCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("qr");

  const verifyCode = async (code: string, type: 'qr' | 'pin') => {
    if (!user || !code.trim()) return;

    setVerifying(true);
    setError(null);
    setVerificationResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('verify-redemption', {
        body: {
          verification_type: type,
          code: code.trim(),
        },
      });

      if (fnError) throw fnError;

      if (data.error) {
        if (data.code === 'INVALID_CODE') {
          setError("Code not found. Please check and try again.");
        } else if (data.code === 'CODE_EXPIRED') {
          setError("This code has expired. Ask customer to generate a new one.");
        } else if (data.code === 'LOCKED_OUT') {
          setError(data.error);
        } else {
          setError(data.error);
        }
        return;
      }

      // Success!
      setVerificationResult(data);
      
      // Trigger haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Error verifying code:", error);
      setError("Failed to verify code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleQRScan = (scannedData: string) => {
    verifyCode(scannedData, 'qr');
  };

  const handlePinSubmit = () => {
    if (pinCode.length === 4) {
      verifyCode(pinCode, 'pin');
    }
  };

  const resetState = () => {
    setShowSuccessDialog(false);
    setPinCode("");
    setVerificationResult(null);
    setError(null);
  };

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
            Scan customer's QR code or enter their PIN
          </p>
        </div>

        {/* Verification Tabs */}
        <Card className="p-6 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                Scan QR
              </TabsTrigger>
              <TabsTrigger value="pin" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Enter PIN
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr">
              <QRScanner onScan={handleQRScan} disabled={verifying} />
            </TabsContent>

            <TabsContent value="pin">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    4-Digit PIN
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter PIN"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      className="text-3xl font-mono text-center tracking-[0.5em]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handlePinSubmit();
                        }
                      }}
                    />
                    <Button
                      onClick={handlePinSubmit}
                      disabled={verifying || pinCode.length !== 4}
                      size="lg"
                    >
                      {verifying ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </Card>

        {/* Help Text */}
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground text-center">
            💡 Ask the customer to show their QR code or tell you their PIN
          </p>
        </Card>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <PartyPopper className="w-10 h-10 text-green-600" />
            </div>
            <AlertDialogTitle className="text-2xl text-center">
              Reward Redeemed!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              {verificationResult && (
                <div className="space-y-3 mt-4">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-semibold text-foreground">
                      {verificationResult.customer.full_name}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Reward</p>
                    <p className="font-semibold text-foreground">
                      {verificationResult.reward.description}
                    </p>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              onClick={resetState}
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

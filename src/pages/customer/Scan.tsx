import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Scan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const qrCodeRegionId = "qr-reader";

  useEffect(() => {
    startScanning();

    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(qrCodeRegionId);
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      };

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      );
      
      setScanning(true);
    } catch (error: any) {
      console.error("Error starting scanner:", error);
      toast.error("Failed to start camera. Please check permissions.");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        if (scanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        setScanning(false);
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    // Prevent multiple scans with both state and ref
    if (scanned || processingRef.current) return;
    
    // Immediately mark as processing and scanned
    processingRef.current = true;
    setScanned(true);
    setScanning(false);
    
    // Stop the scanner immediately
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }

    try {
      // Parse QR code data (expecting format: business_id)
      const businessId = decodedText;

      if (!user) {
        toast.error("Please sign in to collect stamps");
        processingRef.current = false;
        setScanned(false);
        navigate("/auth");
        return;
      }

      // Get or create stamp card
      let { data: stampCard, error: fetchError } = await supabase
        .from('stamp_cards')
        .select('*')
        .eq('customer_id', user.id)
        .eq('business_id', businessId)
        .eq('is_completed', false)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Get loyalty program details
      const { data: loyaltyProgram } = await supabase
        .from('loyalty_programs')
        .select('stamps_required')
        .eq('business_id', businessId)
        .single();

      if (!loyaltyProgram) {
        toast.error("Business loyalty program not found");
        processingRef.current = false;
        setScanned(false);
        startScanning();
        return;
      }

      if (!stampCard) {
        // Create new stamp card
        const { data: newCard, error: createError } = await supabase
          .from('stamp_cards')
          .insert({
            customer_id: user.id,
            business_id: businessId,
            stamps_collected: 1
          })
          .select()
          .single();

        if (createError) throw createError;
        stampCard = newCard;
      } else {
        // Update existing stamp card
        const newStampCount = stampCard.stamps_collected + 1;
        const isCompleted = newStampCount >= loyaltyProgram.stamps_required;

        const { error: updateError } = await supabase
          .from('stamp_cards')
          .update({
            stamps_collected: newStampCount,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null
          })
          .eq('id', stampCard.id);

        if (updateError) throw updateError;
      }

      // Create stamp transaction
      const { error: transactionError } = await supabase
        .from('stamp_transactions')
        .insert({
          customer_id: user.id,
          business_id: businessId,
          stamp_card_id: stampCard.id,
          status: 'verified'
        });

      if (transactionError) throw transactionError;

      toast.success("Stamp collected! ☕", {
        description: "Check your rewards to see your progress"
      });

      // Navigate back to customer home after 2 seconds
      setTimeout(() => {
        navigate("/customer");
      }, 2000);

    } catch (error: any) {
      console.error("Error processing scan:", error);
      toast.error("Failed to collect stamp. Please try again.");
      processingRef.current = false;
      setScanned(false);
      startScanning();
    }
  };

  const onScanFailure = (error: string) => {
    // Silently ignore scan failures - they happen constantly while scanning
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          onClick={() => navigate("/customer")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Scan QR Code</h1>
          <p className="text-muted-foreground">
            Point your camera at the shop's QR code
          </p>
        </div>

        <Card className="p-8 mb-8">
          {scanned ? (
            <div className="aspect-square bg-success/10 rounded-lg flex items-center justify-center mb-6 border-4 border-success">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success" />
                <p className="text-lg font-semibold text-success">Stamp Collected!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Redirecting you back...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div id={qrCodeRegionId} className="rounded-lg overflow-hidden mb-6"></div>
              
              {!scanning && (
                <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center mb-6 border-4 border-dashed border-border">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Initializing camera...</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    Looking for QR code...
                  </span>
                </div>
              </div>
            </>
          )}
        </Card>

        <div className="bg-secondary/50 rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">💡 Tip</p>
          <p className="text-sm">
            Make sure the QR code is clearly visible and well-lit for best results
          </p>
        </div>
      </div>
    </div>
  );
}

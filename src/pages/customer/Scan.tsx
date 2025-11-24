import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasProcessedScan = useRef(false);
  const qrCodeRegionId = "qr-reader";

  // Sound effect for successful scan
  const playSuccessSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Haptic feedback for successful scan
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]); // Pattern: vibrate-pause-vibrate
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startScanning();
    }, 100);

    return () => {
      clearTimeout(timer);
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      console.log("Starting scanner initialization...");
      
      // Make sure element exists
      const element = document.getElementById(qrCodeRegionId);
      if (!element) {
        console.error("QR reader element not found");
        setError("Scanner element not ready");
        return;
      }
      
      // Clear any existing scanner
      if (scannerRef.current) {
        try {
          const state = await scannerRef.current.getState();
          if (state === 2) {
            await scannerRef.current.stop();
          }
          await scannerRef.current.clear();
          scannerRef.current = null;
        } catch (e) {
          console.log("Error clearing previous scanner:", e);
        }
      }
      
      // Wait a bit before creating new scanner
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("Creating new Html5Qrcode instance...");
      scannerRef.current = new Html5Qrcode(qrCodeRegionId);

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false
      };

      console.log("Starting camera...");
      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      );
      
      setScanning(true);
      console.log("Scanner started successfully!");
    } catch (error: any) {
      console.error("Error starting scanner:", error);
      const errorMessage = error?.message || "Failed to start camera";
      setError(errorMessage);
      
      if (errorMessage.includes("NotAllowedError") || errorMessage.includes("permission")) {
        toast.error("Camera permission denied. Please allow camera access in your browser settings.");
      } else if (errorMessage.includes("NotFoundError")) {
        toast.error("No camera found on this device.");
      } else {
        toast.error("Failed to start camera. Please try again.");
      }
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        const state = await scannerRef.current.getState();
        if (state === 2) { // Scanner is running
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
        setScanning(false);
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    // Prevent multiple scans
    if (hasProcessedScan.current) return;
    hasProcessedScan.current = true;
    
    console.log("QR Code scanned:", decodedText);
    
    // Immediately stop scanning and show success state
    setScanned(true);
    setScanning(false);
    
    // Stop the scanner immediately
    if (scannerRef.current) {
      try {
        const state = await scannerRef.current.getState();
        if (state === 2) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }

    try {
      // Parse QR code data (expecting format: business_id)
      const businessId = decodedText;

      if (!user) {
        toast.error("Please sign in to collect stamps");
        navigate("/auth");
        return;
      }

      // Check daily scan limit
      const { data: dailyCheck, error: dailyError } = await supabase.rpc('check_daily_scan_limit', {
        p_customer_id: user.id,
        p_business_id: businessId,
        p_max_scans_per_day: 10
      });

      if (dailyError) {
        console.error("Error checking daily limit:", dailyError);
        throw dailyError;
      }

      if (!dailyCheck) {
        toast.error("Daily scan limit reached (10 scans/day). Please try again tomorrow.");
        setTimeout(() => navigate("/customer"), 1500);
        return;
      }

      // Check weekly scan limit
      const { data: weeklyCheck, error: weeklyError } = await supabase.rpc('check_weekly_scan_limit', {
        p_customer_id: user.id,
        p_business_id: businessId,
        p_max_scans_per_week: 50
      });

      if (weeklyError) {
        console.error("Error checking weekly limit:", weeklyError);
        throw weeklyError;
      }

      if (!weeklyCheck) {
        toast.error("Weekly scan limit reached (50 scans/week). Please try again later.");
        setTimeout(() => navigate("/customer"), 1500);
        return;
      }

      // Get loyalty program details first
      const { data: loyaltyProgram, error: programError } = await supabase
        .from('loyalty_programs')
        .select('stamps_required')
        .eq('business_id', businessId)
        .single();

      if (programError || !loyaltyProgram) {
        console.error("Error fetching loyalty program:", programError);
        toast.error("Business loyalty program not found");
        setTimeout(() => navigate("/customer"), 1500);
        return;
      }

      // Get or create stamp card with better error handling
      let { data: stampCard, error: fetchError } = await supabase
        .from('stamp_cards')
        .select('*')
        .eq('customer_id', user.id)
        .eq('business_id', businessId)
        .eq('is_completed', false)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching stamp card:", fetchError);
        throw fetchError;
      }

      let newStampCount = 1;
      let stampCardId = '';

      if (!stampCard) {
        // Create new stamp card - first check one more time if it exists
        const { data: doubleCheck } = await supabase
          .from('stamp_cards')
          .select('*')
          .eq('customer_id', user.id)
          .eq('business_id', businessId)
          .eq('is_completed', false)
          .maybeSingle();

        if (doubleCheck) {
          // Card exists, use it
          stampCard = doubleCheck;
        } else {
          // Try to create new card
          const { data: newCard, error: createError } = await supabase
            .from('stamp_cards')
            .insert({
              customer_id: user.id,
              business_id: businessId,
              stamps_collected: 1,
              is_completed: false
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating stamp card:", createError);
            toast.error("Failed to create stamp card. Please try again.");
            setTimeout(() => navigate("/customer"), 1500);
            return;
          }

          stampCardId = newCard.id;
          newStampCount = 1;
        }
      }

      // If we have an existing card, update it
      if (stampCard) {
        // Update existing stamp card
        newStampCount = stampCard.stamps_collected + 1;
        const isCompleted = newStampCount >= loyaltyProgram.stamps_required;

        const { error: updateError } = await supabase
          .from('stamp_cards')
          .update({
            stamps_collected: newStampCount,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null
          })
          .eq('id', stampCard.id);

        if (updateError) {
          console.error("Error updating stamp card:", updateError);
          throw updateError;
        }

        stampCardId = stampCard.id;
      }

      // Create stamp transaction
      const { error: transactionError } = await supabase
        .from('stamp_transactions')
        .insert({
          customer_id: user.id,
          business_id: businessId,
          stamp_card_id: stampCardId,
          status: 'verified'
        });

      if (transactionError) {
        console.error("Error creating transaction:", transactionError);
        throw transactionError;
      }

      console.log("Stamp collected successfully! New count:", newStampCount);

      // Trigger haptic feedback and sound
      triggerHapticFeedback();
      playSuccessSound();

      // Show success with smooth animation
      toast.success("Stamp collected! ☕", {
        description: `You now have ${newStampCount} stamp${newStampCount !== 1 ? 's' : ''}!`,
        duration: 2000,
      });

      // Navigate back after animation
      setTimeout(() => {
        navigate("/customer", { state: { newStamp: true, stampCount: newStampCount } });
      }, 1800);

    } catch (error: any) {
      console.error("Error processing scan:", error);
      toast.error("Failed to collect stamp. Please try again.");
      hasProcessedScan.current = false;
      setScanned(false);
      setTimeout(() => navigate("/customer"), 1500);
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
            <div className="aspect-square bg-success/10 rounded-lg flex items-center justify-center border-4 border-success animate-scale-in">
              <div className="text-center">
                <div className="relative">
                  <CheckCircle className="w-24 h-24 mx-auto mb-4 text-success animate-scale-in" />
                  <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-success/20 animate-ping" />
                </div>
                <p className="text-xl font-bold text-success animate-fade-in">Stamp Collected!</p>
                <p className="text-sm text-muted-foreground mt-2 animate-fade-in">
                  Taking you back...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="aspect-square bg-destructive/10 rounded-lg flex items-center justify-center border-4 border-dashed border-destructive">
              <div className="text-center p-6">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
                <p className="text-lg font-semibold text-destructive mb-2">Camera Error</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={startScanning} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div 
                id={qrCodeRegionId} 
                className="rounded-lg overflow-hidden mb-6 w-full"
                style={{ 
                  minHeight: '300px',
                  width: '100%'
                }}
              ></div>
              
              {!scanning && !error && (
                <div className="absolute inset-0 bg-muted/30 rounded-lg flex items-center justify-center border-4 border-dashed border-border">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
                    <p className="text-muted-foreground">Initializing camera...</p>
                  </div>
                </div>
              )}

              {scanning && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                      Looking for QR code...
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        <div className="bg-secondary/50 rounded-lg p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground mb-2">💡 Tips</p>
          <p className="text-sm">
            Make sure the QR code is clearly visible and well-lit for best results
          </p>
          <p className="text-xs text-muted-foreground">
            Daily limit: 10 scans • Weekly limit: 50 scans
          </p>
        </div>
      </div>
    </div>
  );
}

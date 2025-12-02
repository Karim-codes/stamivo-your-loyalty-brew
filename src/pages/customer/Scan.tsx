import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ValidationResult {
  success: boolean;
  error?: string;
  message: string;
  status?: 'verified' | 'pending';
  stamps_collected?: number;
  stamps_required?: number;
  is_completed?: boolean;
  wait_minutes?: number;
}

export default function Scan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<ValidationResult | null>(null);
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
      navigator.vibrate([100, 50, 100]);
    }
  };

  useEffect(() => {
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
      
      const element = document.getElementById(qrCodeRegionId);
      if (!element) {
        console.error("QR reader element not found");
        setError("Scanner element not ready");
        return;
      }
      
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
        if (state === 2) {
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
    if (hasProcessedScan.current) return;
    hasProcessedScan.current = true;
    
    console.log("QR Code scanned:", decodedText);
    
    setScanned(true);
    setScanning(false);
    
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
      const businessId = decodedText;

      if (!user) {
        toast.error("Please sign in to collect stamps");
        navigate("/auth");
        return;
      }

      // Use the new atomic validation function
      console.log("Calling validate_and_award_stamp...");
      const { data, error: rpcError } = await supabase.rpc('validate_and_award_stamp', {
        p_customer_id: user.id,
        p_business_id: businessId
      });

      if (rpcError) {
        console.error("RPC error:", rpcError);
        throw rpcError;
      }

      const result = data as unknown as ValidationResult;
      console.log("Validation result:", result);
      setScanResult(result);

      if (!result.success) {
        // Handle specific error cases
        switch (result.error) {
          case 'TOO_SOON':
            const waitMins = Math.ceil(result.wait_minutes || 0);
            toast.error(`Please wait ${waitMins} more minutes before scanning again`);
            break;
          case 'DAILY_LIMIT':
            toast.error("Daily stamp limit reached. Try again tomorrow!");
            break;
          case 'SHOP_CLOSED':
          case 'OUTSIDE_HOURS':
            toast.error(result.message || "Shop is currently closed for stamps");
            break;
          case 'NO_ACTIVE_PROGRAM':
            toast.error("This shop doesn't have an active loyalty program");
            break;
          case 'INVALID_BUSINESS':
            toast.error("Invalid QR code");
            break;
          default:
            toast.error(result.message || "Failed to collect stamp");
        }
        setTimeout(() => navigate("/customer"), 2000);
        return;
      }

      // Success!
      triggerHapticFeedback();
      playSuccessSound();

      if (result.status === 'verified') {
        // Instant stamp awarded
        if (result.is_completed) {
          toast.success("🎉 Congratulations!", {
            description: "You've earned a free reward!"
          });
        } else {
          toast.success("✅ Stamp collected!", {
            description: `${result.stamps_collected}/${result.stamps_required} stamps`
          });
        }
      } else {
        // Pending approval
        toast.success("✅ Stamp request sent!", {
          description: "Waiting for barista approval..."
        });
      }
      
      setTimeout(() => navigate("/customer"), 1500);

    } catch (error: any) {
      console.error("Error processing scan:", error);
      toast.error("Failed to collect stamp. Please try again.");
      hasProcessedScan.current = false;
      setScanned(false);
      setTimeout(() => navigate("/customer"), 1500);
    }
  };

  const onScanFailure = (error: string) => {
    // Silently ignore scan failures
  };

  const getSuccessMessage = () => {
    if (!scanResult) return { title: "Processing...", subtitle: "" };
    
    if (scanResult.status === 'verified') {
      if (scanResult.is_completed) {
        return {
          title: "🎉 Reward Unlocked!",
          subtitle: "You've earned a free reward!"
        };
      }
      return {
        title: "Stamp Collected!",
        subtitle: `${scanResult.stamps_collected}/${scanResult.stamps_required} stamps`
      };
    }
    
    return {
      title: "Request Sent!",
      subtitle: "Waiting for approval..."
    };
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
            <div className={`aspect-square rounded-lg flex items-center justify-center border-4 animate-scale-in ${
              scanResult?.success 
                ? 'bg-success/10 border-success' 
                : 'bg-warning/10 border-warning'
            }`}>
              <div className="text-center">
                {scanResult?.success ? (
                  <>
                    <div className="relative">
                      <CheckCircle className={`w-24 h-24 mx-auto mb-4 animate-scale-in ${
                        scanResult.is_completed ? 'text-yellow-500' : 'text-success'
                      }`} />
                      <div className={`absolute inset-0 w-24 h-24 mx-auto rounded-full animate-ping ${
                        scanResult.is_completed ? 'bg-yellow-500/20' : 'bg-success/20'
                      }`} />
                    </div>
                    <p className="text-xl font-bold text-success animate-fade-in">
                      {getSuccessMessage().title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 animate-fade-in">
                      {getSuccessMessage().subtitle}
                    </p>
                  </>
                ) : (
                  <>
                    <Clock className="w-24 h-24 mx-auto mb-4 text-warning animate-pulse" />
                    <p className="text-xl font-bold text-warning animate-fade-in">
                      {scanResult?.message || "Please wait..."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 animate-fade-in">
                      Taking you back...
                    </p>
                  </>
                )}
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
            Stamps are awarded instantly when you scan!
          </p>
        </div>
      </div>
    </div>
  );
}
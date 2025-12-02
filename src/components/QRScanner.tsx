import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";

interface QRScannerProps {
  onScan: (data: string) => void;
  disabled?: boolean;
}

export function QRScanner({ onScan, disabled }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    if (!containerRef.current || disabled) return;

    try {
      setError(null);
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        () => {
          // Ignore scan errors
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Scanner error:", err);
      setError(err.message || "Failed to start camera");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        id="qr-reader" 
        className="w-full max-w-sm mx-auto aspect-square bg-muted rounded-lg overflow-hidden"
        style={{ display: isScanning ? 'block' : 'none' }}
      />

      {!isScanning && (
        <div className="w-full max-w-sm mx-auto aspect-square bg-muted rounded-lg flex flex-col items-center justify-center gap-4">
          <Camera className="w-16 h-16 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center px-4">
            Point camera at customer's QR code
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <Button
        onClick={isScanning ? stopScanner : startScanner}
        variant={isScanning ? "outline" : "default"}
        className="w-full"
        disabled={disabled}
      >
        {isScanning ? (
          <>
            <CameraOff className="w-4 h-4 mr-2" />
            Stop Scanner
          </>
        ) : (
          <>
            <Camera className="w-4 h-4 mr-2" />
            Start Scanner
          </>
        )}
      </Button>
    </div>
  );
}

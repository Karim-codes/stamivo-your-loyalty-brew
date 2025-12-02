import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, QrCode, KeyRound } from "lucide-react";
import { toast } from "sonner";

interface RedemptionQRCodeProps {
  qrToken: string;
  pinCode: string;
  qrExpiresAt: string;
  pinExpiresAt: string;
  redemptionMode: string;
  onRefresh: () => void;
  refreshing: boolean;
}

export function RedemptionQRCode({
  qrToken,
  pinCode,
  qrExpiresAt,
  pinExpiresAt,
  redemptionMode,
  onRefresh,
  refreshing,
}: RedemptionQRCodeProps) {
  const [qrSecondsLeft, setQrSecondsLeft] = useState(0);
  const [pinSecondsLeft, setPinSecondsLeft] = useState(0);

  const calculateSecondsLeft = useCallback((expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }, []);

  useEffect(() => {
    setQrSecondsLeft(calculateSecondsLeft(qrExpiresAt));
    setPinSecondsLeft(calculateSecondsLeft(pinExpiresAt));

    const interval = setInterval(() => {
      setQrSecondsLeft(calculateSecondsLeft(qrExpiresAt));
      setPinSecondsLeft(calculateSecondsLeft(pinExpiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [qrExpiresAt, pinExpiresAt, calculateSecondsLeft]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const qrExpired = qrSecondsLeft <= 0;
  const pinExpired = pinSecondsLeft <= 0;
  const allExpired = qrExpired && pinExpired;

  const showQR = redemptionMode === 'qr_only' || redemptionMode === 'both';
  const showPIN = redemptionMode === 'pin_only' || redemptionMode === 'both';

  return (
    <div className="space-y-6">
      {/* QR Code Section */}
      {showQR && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <QrCode className="w-5 h-5 text-primary" />
            <span className="font-medium">Scan QR Code</span>
          </div>
          
          <div className="relative inline-block">
            <div className={`p-4 bg-white rounded-2xl shadow-lg transition-opacity ${qrExpired ? 'opacity-30' : ''}`}>
              <QRCodeSVG
                value={qrToken}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
            
            {qrExpired && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-2xl">
                <div className="text-center">
                  <p className="text-sm font-medium text-destructive mb-2">QR Expired</p>
                  <Button size="sm" onClick={onRefresh} disabled={refreshing}>
                    <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!qrExpired && (
            <div className="mt-3">
              <Badge 
                variant={qrSecondsLeft <= 10 ? "destructive" : "secondary"}
                className="text-lg px-4 py-1"
              >
                {qrSecondsLeft}s
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Ask barista to scan this code
              </p>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      {showQR && showPIN && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>
      )}

      {/* PIN Section */}
      {showPIN && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <KeyRound className="w-5 h-5 text-primary" />
            <span className="font-medium">Tell PIN to Barista</span>
          </div>
          
          <div className={`bg-secondary/50 rounded-xl p-4 ${pinExpired ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-center gap-2">
              <p className="text-5xl font-bold tracking-[0.3em] font-mono">
                {pinCode}
              </p>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(pinCode)}
                disabled={pinExpired}
              >
                <Copy className="w-5 h-5" />
              </Button>
            </div>
            
            {!pinExpired ? (
              <div className="mt-2">
                <Badge 
                  variant={pinSecondsLeft <= 30 ? "destructive" : "secondary"}
                >
                  Expires in {Math.floor(pinSecondsLeft / 60)}:{(pinSecondsLeft % 60).toString().padStart(2, '0')}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-destructive mt-2">PIN Expired</p>
            )}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      {allExpired && (
        <Button onClick={onRefresh} disabled={refreshing} className="w-full">
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Generate New Codes
        </Button>
      )}
    </div>
  );
}

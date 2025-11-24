import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

export default function QRCodePage() {
  const { user } = useAuth();
  const [businessId, setBusinessId] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBusinessInfo();
    }
  }, [user]);

  const fetchBusinessInfo = async () => {
    try {
      if (!user) return;

      const { data: businesses, error } = await supabase
        .from('businesses')
        .select('id, business_name')
        .eq('owner_id', user.id)
        .limit(1);

      if (error) throw error;

      if (businesses && businesses.length > 0) {
        setBusinessId(businesses[0].id);
        setBusinessName(businesses[0].business_name);
      }
    } catch (error: any) {
      console.error('Error fetching business info:', error);
      toast.error("Failed to load business information");
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("business-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${businessName}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success("QR Code downloaded!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const printQRCode = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your QR Code</h1>
          <p className="text-muted-foreground">
            Display this QR code at your counter for customers to scan
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-6 text-center">{businessName}</h2>
              
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6" id="qr-code-container">
                <QRCodeSVG
                  id="business-qr-code"
                  value={businessId}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <p className="text-sm text-center text-muted-foreground mb-6">
                Scan to collect stamps
              </p>

              <div className="flex gap-3 w-full">
                <Button onClick={downloadQRCode} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={printQRCode} variant="outline" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-lg font-semibold mb-4">How to Use</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium">Display Your QR Code</p>
                  <p className="text-sm text-muted-foreground">
                    Print or display this QR code at your counter where customers can easily see it
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium">Customer Scans</p>
                  <p className="text-sm text-muted-foreground">
                    Customers open the app and use the scan feature to capture your QR code
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium">Stamp Added</p>
                  <p className="text-sm text-muted-foreground">
                    A stamp is automatically added to their loyalty card
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">4</span>
                </div>
                <div>
                  <p className="font-medium">Track Progress</p>
                  <p className="text-sm text-muted-foreground">
                    Monitor customer visits and stamp collections in your dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Pro Tip:</strong> Place the QR code next to your register or on a table tent for maximum visibility
              </p>
            </div>
          </Card>
        </div>

        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #qr-code-container, #qr-code-container * {
                visibility: visible;
              }
              #qr-code-container {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}

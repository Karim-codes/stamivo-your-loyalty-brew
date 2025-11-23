import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Scan() {
  const navigate = useNavigate();

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
          <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center mb-6 border-4 border-dashed border-border">
            <div className="text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Camera scanner</p>
              <p className="text-sm text-muted-foreground mt-2">
                (Would be active camera in production)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Looking for QR code...
              </span>
            </div>
          </div>
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

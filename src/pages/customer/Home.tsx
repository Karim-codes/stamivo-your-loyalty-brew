import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QrCode, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CustomerHome() {
  const navigate = useNavigate();

  // Mock data for demonstration
  const shops = [
    {
      id: 1,
      name: "Brew & Bean",
      address: "123 Coffee St",
      stampsCollected: 3,
      stampsRequired: 5,
      reward: "Free coffee of choice",
    },
    {
      id: 2,
      name: "The Daily Grind",
      address: "456 Main Ave",
      stampsCollected: 7,
      stampsRequired: 8,
      reward: "Free pastry + coffee",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Stamps</h1>
          <p className="text-muted-foreground">Keep collecting to earn rewards!</p>
        </div>

        <div className="space-y-4 mb-8">
          {shops.map((shop) => {
            const progress = (shop.stampsCollected / shop.stampsRequired) * 100;
            const isComplete = shop.stampsCollected >= shop.stampsRequired;

            return (
              <Card
                key={shop.id}
                className={`p-6 transition-all hover:shadow-lg ${
                  isComplete ? "border-2 border-success" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{shop.name}</h3>
                    <p className="text-sm text-muted-foreground">{shop.address}</p>
                  </div>
                  {isComplete && (
                    <Gift className="w-6 h-6 text-success animate-bounce" />
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {shop.stampsCollected}/{shop.stampsRequired} stamps
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="flex gap-2 mb-4">
                  {Array.from({ length: shop.stampsRequired }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 aspect-square rounded-full border-2 flex items-center justify-center text-2xl transition-all ${
                        i < shop.stampsCollected
                          ? "bg-primary border-primary scale-110"
                          : "border-muted"
                      }`}
                    >
                      {i < shop.stampsCollected ? "☕" : ""}
                    </div>
                  ))}
                </div>

                {isComplete ? (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-success text-center">
                      🎉 {shop.reward}
                    </p>
                    <Button className="w-full mt-3" variant="default">
                      Redeem Now
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">
                    Reward: {shop.reward}
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        <Button
          onClick={() => navigate("/customer/scan")}
          size="lg"
          className="w-full h-16 text-xl rounded-full shadow-lg hover:scale-105 transition-all"
        >
          <QrCode className="mr-2 w-6 h-6" />
          Scan QR Code
        </Button>
      </div>
    </div>
  );
}

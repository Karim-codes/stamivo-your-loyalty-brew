import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Rewards() {
  const navigate = useNavigate();

  const completedRewards = [
    {
      id: 1,
      shop: "Brew & Bean",
      reward: "Free coffee of choice",
      completedDate: "2024-01-15",
      redeemed: false,
    },
  ];

  const pendingRewards = [
    {
      id: 2,
      shop: "The Daily Grind",
      stampsCollected: 7,
      stampsRequired: 8,
      reward: "Free pastry + coffee",
    },
  ];

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Rewards</h1>
          <p className="text-muted-foreground">View and redeem your rewards</p>
        </div>

        <Tabs defaultValue="completed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">In Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="completed" className="space-y-4">
            {completedRewards.map((reward) => (
              <Card key={reward.id} className="p-6 border-2 border-success">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{reward.shop}</h3>
                    <p className="text-muted-foreground">{reward.reward}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed {reward.completedDate}
                    </p>
                  </div>
                </div>
                {!reward.redeemed && (
                  <Button className="w-full" size="lg">
                    Redeem Reward
                  </Button>
                )}
                {reward.redeemed && (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    ✓ Redeemed
                  </div>
                )}
              </Card>
            ))}
            {completedRewards.length === 0 && (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No completed rewards yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Keep collecting stamps to earn rewards!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingRewards.map((reward) => {
              const progress =
                (reward.stampsCollected / reward.stampsRequired) * 100;

              return (
                <Card key={reward.id} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{reward.shop}</h3>
                      <p className="text-muted-foreground">{reward.reward}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: reward.stampsRequired }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 aspect-square rounded-full border-2 flex items-center justify-center text-xl ${
                          i < reward.stampsCollected
                            ? "bg-primary border-primary"
                            : "border-muted"
                        }`}
                      >
                        {i < reward.stampsCollected ? "☕" : ""}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-center text-muted-foreground mt-4">
                    {reward.stampsRequired - reward.stampsCollected} more{" "}
                    {reward.stampsRequired - reward.stampsCollected === 1
                      ? "stamp"
                      : "stamps"}{" "}
                    to go!
                  </p>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

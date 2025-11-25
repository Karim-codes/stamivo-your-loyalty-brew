import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface StampCard {
  id: string;
  stamps_collected: number;
  is_completed: boolean;
  completed_at: string | null;
  has_redeemed_reward?: boolean;
  businesses: {
    business_name: string;
    logo_url: string | null;
    loyalty_programs: {
      stamps_required: number;
      reward_description: string;
    }[];
  };
}

export default function Rewards() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedCards, setCompletedCards] = useState<StampCard[]>([]);
  const [pendingCards, setPendingCards] = useState<StampCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStampCards();
    }
  }, [user]);

  const fetchStampCards = async () => {
    try {
      const { data, error } = await supabase
        .from("stamp_cards")
        .select(`
          *,
          businesses!stamp_cards_business_id_fkey (
            business_name,
            logo_url,
            loyalty_programs (
              stamps_required,
              reward_description
            )
          )
        `)
        .eq("customer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const completed = data?.filter((card) => card.is_completed) || [];
      const pending = data?.filter((card) => !card.is_completed) || [];

      // Check which completed cards have been redeemed
      const completedWithRedemptionStatus = await Promise.all(
        completed.map(async (card) => {
          const { data: redemptionData } = await supabase
            .from('rewards_redeemed')
            .select('is_redeemed')
            .eq('stamp_card_id', card.id)
            .eq('is_redeemed', true)
            .maybeSingle();

          return {
            ...card,
            has_redeemed_reward: !!redemptionData
          };
        })
      );

      setCompletedCards(completedWithRedemptionStatus as any);
      setPendingCards(pending as any);
    } catch (error) {
      console.error("Error fetching stamp cards:", error);
      toast.error("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading rewards...</p>
        </div>
      </div>
    );
  }

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
            {completedCards.map((card) => (
              <Card key={card.id} className="p-6 border-2 border-success">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{card.businesses.business_name}</h3>
                    <p className="text-muted-foreground">
                      {card.businesses.loyalty_programs[0]?.reward_description || "Reward"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed {card.completed_at ? new Date(card.completed_at).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
                {card.has_redeemed_reward ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant="secondary"
                    disabled
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Already Redeemed
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate("/customer/redeem")}
                  >
                    Redeem Reward
                  </Button>
                )}
              </Card>
            ))}
            {completedCards.length === 0 && (
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
            {pendingCards.map((card) => {
              const stampsRequired = card.businesses.loyalty_programs[0]?.stamps_required || 5;
              const progress = (card.stamps_collected / stampsRequired) * 100;

              return (
                <Card key={card.id} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{card.businesses.business_name}</h3>
                      <p className="text-muted-foreground">
                        {card.businesses.loyalty_programs[0]?.reward_description || "Reward"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: stampsRequired }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 aspect-square rounded-full border-2 flex items-center justify-center text-xl ${
                          i < card.stamps_collected
                            ? "bg-primary border-primary"
                            : "border-muted"
                        }`}
                      >
                        {i < card.stamps_collected ? "☕" : ""}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-center text-muted-foreground mt-4">
                    {stampsRequired - card.stamps_collected} more{" "}
                    {stampsRequired - card.stamps_collected === 1
                      ? "stamp"
                      : "stamps"}{" "}
                    to go!
                  </p>
                </Card>
              );
            })}
            {pendingCards.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No pending rewards</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Scan a QR code to start collecting stamps!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

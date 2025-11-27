import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QrCode, ArrowRight, Gift, Coffee, User, LogOut, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfettiEffect } from "@/components/ConfettiEffect";

interface StampCard {
  id: string;
  stamps_collected: number;
  is_completed: boolean;
  has_redeemed_reward?: boolean;
  business: {
    id: string;
    business_name: string;
    address: string;
    logo_url: string | null;
  };
  loyalty_program: {
    stamps_required: number;
    reward_description: string;
  };
}

interface GroupedStampCards {
  business: {
    id: string;
    business_name: string;
    address: string;
    logo_url: string | null;
  };
  cards: StampCard[];
}

export default function CustomerHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [stampCards, setStampCards] = useState<StampCard[]>([]);
  const [groupedCards, setGroupedCards] = useState<GroupedStampCards[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStampCards();
    }
    
    // Show notification if coming from scan
    if (location.state?.newStamp) {
      const stampCount = location.state?.stampCount || 0;
      const isCompleted = location.state?.isCompleted || false;
      
      if (isCompleted) {
        // Trigger confetti for completed card
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        toast.success("🎉 Stamp card completed!", {
          description: "You've earned a reward! Check the Redeem page.",
          duration: 5000,
        });
      } else {
        toast.success("Stamp collected! ☕", {
          description: `You now have ${stampCount} stamp${stampCount !== 1 ? 's' : ''}!`,
          duration: 3000,
        });
      }
      
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [user, location.state]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const fetchStampCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('stamp_cards')
        .select(`
          id,
          stamps_collected,
          is_completed,
          businesses!inner (
            id,
            business_name,
            address,
            logo_url
          )
        `)
        .eq('customer_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Fetch loyalty programs for each business
      const cardsWithPrograms = await Promise.all(
        (data || []).map(async (card: any) => {
          const { data: programData } = await supabase
            .from('loyalty_programs')
            .select('stamps_required, reward_description')
            .eq('business_id', card.businesses.id)
            .eq('is_active', true)
            .maybeSingle();

          // Check if this card has been redeemed
          const { data: redemptionData } = await supabase
            .from('rewards_redeemed')
            .select('is_redeemed')
            .eq('stamp_card_id', card.id)
            .eq('is_redeemed', true)
            .maybeSingle();

          return {
            id: card.id,
            stamps_collected: card.stamps_collected,
            is_completed: card.is_completed,
            has_redeemed_reward: !!redemptionData,
            business: card.businesses,
            loyalty_program: programData || { stamps_required: 5, reward_description: 'Free reward' },
          };
        })
      );

      setStampCards(cardsWithPrograms);

      // Group cards by business
      const grouped = cardsWithPrograms.reduce((acc: GroupedStampCards[], card) => {
        const existingGroup = acc.find(g => g.business.id === card.business.id);
        if (existingGroup) {
          existingGroup.cards.push(card);
        } else {
          acc.push({
            business: card.business,
            cards: [card]
          });
        }
        return acc;
      }, []);

      setGroupedCards(grouped);
    } catch (error: any) {
      console.error('Error fetching stamp cards:', error);
      toast.error("Failed to load your stamp cards");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your stamps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pb-20">
      {/* Confetti Effect */}
      <ConfettiEffect trigger={showConfetti} />
      
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Stamps</h1>
            <p className="text-primary-foreground/90">
              Collect stamps and earn rewards!
            </p>
          </div>
          
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">My Account</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/customer/profile")} className="cursor-pointer">
                <User className="mr-2 w-4 h-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/customer/history")} className="cursor-pointer">
                <Clock className="mr-2 w-4 h-4" />
                View History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Redeem Button */}
        {stampCards.some(card => card.is_completed && !card.has_redeemed_reward) && (
          <Button 
            onClick={() => navigate("/customer/redeem")}
            variant="secondary"
            className="w-full mt-4"
          >
            <Gift className="mr-2 w-4 h-4" />
            Redeem Rewards
          </Button>
        )}
      </div>

      {/* Shops - Desktop Grid Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {groupedCards.length === 0 ? (
          <div className="lg:col-span-2 xl:col-span-3">
            <Card className="p-8 text-center space-y-4">
              <Coffee className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-xl font-bold mb-2">No stamp cards yet</h3>
                <p className="text-muted-foreground">
                  Scan a QR code at a coffee shop to start collecting stamps!
                </p>
              </div>
              <Button onClick={() => navigate("/customer/scan")} size="lg">
                <QrCode className="mr-2 w-5 h-5" />
                Scan QR Code
              </Button>
            </Card>
          </div>
        ) : (
          groupedCards.map((group) => (
            <Card key={group.business.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              {/* Business Header */}
              <div 
                className="p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent cursor-pointer hover:from-primary/15 hover:via-primary/10 transition-all duration-300"
                onClick={() => navigate("/customer/rewards")}
              >
                <div className="flex items-center gap-4">
                  {group.business.logo_url ? (
                    <img
                      src={group.business.logo_url}
                      alt={group.business.business_name}
                      className="w-16 h-16 rounded-full object-cover border-3 border-primary/30 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center border-3 border-primary/30 shadow-lg">
                      <Coffee className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-0.5">{group.business.business_name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{group.business.address}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Stamp Cards for this Business */}
              <div className="divide-y flex-1 flex flex-col">
                {group.cards.map((card) => {
                  const isInactive = card.is_completed || card.has_redeemed_reward;
                  const isCompleted = card.is_completed && !card.has_redeemed_reward;
                  
                  return (
                    <div 
                      key={card.id}
                      className={`p-5 transition-all flex-1 ${
                        isInactive 
                          ? 'opacity-60 bg-muted/20' 
                          : 'hover:bg-gradient-to-r hover:from-accent/5 hover:to-transparent'
                      } ${isCompleted ? 'animate-pulse' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-foreground">
                          {card.stamps_collected} / {card.loyalty_program.stamps_required} stamps
                        </p>
                        {card.has_redeemed_reward && (
                          <span className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full font-medium border border-border">
                            ✓ Redeemed
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-xs bg-gradient-to-r from-success to-success/80 text-white px-4 py-1.5 rounded-full font-bold shadow-lg animate-bounce">
                            🎉 Ready!
                          </span>
                        )}
                      </div>

                      <Progress
                        value={(card.stamps_collected / card.loyalty_program.stamps_required) * 100}
                        className={`h-2.5 mb-4 ${isCompleted ? 'animate-pulse' : ''}`}
                      />

                      {/* Stamp visualization */}
                      <div className="flex gap-2.5 mb-4 flex-wrap justify-center">
                        {Array.from({ length: card.loyalty_program.stamps_required }).map((_, i) => {
                          const isCollected = i < card.stamps_collected;
                          const justCompleted = isCompleted && i === card.stamps_collected - 1;
                          
                          return (
                            <div
                              key={i}
                              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                                isCollected
                                  ? isInactive 
                                    ? "bg-muted border-muted-foreground/30 text-muted-foreground scale-95"
                                    : "bg-gradient-to-br from-primary to-primary/80 border-primary/50 text-white shadow-lg scale-105"
                                  : "border-muted-foreground/20 text-muted-foreground/30 scale-90"
                              } ${justCompleted ? 'animate-bounce' : ''} ${isCollected && !isInactive ? 'hover:scale-110' : ''}`}
                              style={{
                                animationDelay: `${i * 0.1}s`
                              }}
                            >
                              {isCollected ? "☕" : ""}
                            </div>
                          );
                        })}
                      </div>

                      <div className={`flex items-center gap-2.5 text-sm p-3 rounded-xl transition-all ${
                        isInactive 
                          ? 'bg-muted/50 text-muted-foreground' 
                          : 'bg-gradient-to-r from-success/15 to-success/5 text-success border border-success/20'
                      }`}>
                        <Gift className={`w-5 h-5 ${isCompleted ? 'animate-bounce' : ''}`} />
                        <span className="font-semibold">{card.loyalty_program.reward_description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))
        )}
        </div>
      </div>

      {/* Floating Scan Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={() => navigate("/customer/scan")}
          size="lg"
          className="h-16 px-8 text-lg rounded-full shadow-2xl hover:scale-105 transition-all"
        >
          <QrCode className="mr-2 w-6 h-6" />
          Scan QR Code
        </Button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QrCode, ArrowRight, Gift, Coffee, User, LogOut, Clock, Store, MapPin } from "lucide-react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

interface ExploreBusiness {
  id: string;
  business_name: string;
  address: string | null;
  logo_url: string | null;
  loyalty_program?: {
    stamps_required: number;
    reward_description: string;
  };
}

export default function CustomerHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [stampCards, setStampCards] = useState<StampCard[]>([]);
  const [exploreShops, setExploreShops] = useState<ExploreBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStampCards();
      fetchExploreShops();
    }
    
    // Show notification if coming from scan
    if (location.state?.newStamp) {
      const stampCount = location.state?.stampCount || 0;
      const isCompleted = location.state?.isCompleted || false;
      
      if (isCompleted) {
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

      const cardsWithPrograms = await Promise.all(
        (data || []).map(async (card: any) => {
          const { data: programData } = await supabase
            .from('loyalty_programs')
            .select('stamps_required, reward_description')
            .eq('business_id', card.businesses.id)
            .eq('is_active', true)
            .maybeSingle();

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
    } catch (error: any) {
      console.error('Error fetching stamp cards:', error);
      toast.error("Failed to load your stamp cards");
    } finally {
      setLoading(false);
    }
  };

  const fetchExploreShops = async () => {
    if (!user) return;

    try {
      // Get businesses the user already has cards for
      const { data: userCards } = await supabase
        .from('stamp_cards')
        .select('business_id')
        .eq('customer_id', user.id);

      const userBusinessIds = (userCards || []).map(c => c.business_id);

      // Fetch public businesses
      const { data: businesses, error } = await supabase
        .from('businesses')
        .select(`
          id,
          business_name,
          address,
          logo_url
        `)
        .eq('is_public', true)
        .limit(10);

      if (error) throw error;

      // Filter out businesses the user already has cards for
      const newBusinesses = (businesses || []).filter(b => !userBusinessIds.includes(b.id));

      // Fetch loyalty programs for these businesses
      const businessesWithPrograms = await Promise.all(
        newBusinesses.map(async (business) => {
          const { data: programData } = await supabase
            .from('loyalty_programs')
            .select('stamps_required, reward_description')
            .eq('business_id', business.id)
            .eq('is_active', true)
            .maybeSingle();

          return {
            ...business,
            loyalty_program: programData || undefined,
          };
        })
      );

      // Only show businesses with active loyalty programs
      setExploreShops(businessesWithPrograms.filter(b => b.loyalty_program));
    } catch (error) {
      console.error('Error fetching explore shops:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pb-24">
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-8">
        
        {/* My Cards Section - Carousel */}
        {stampCards.length === 0 ? (
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
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-primary" />
              My Loyalty Cards
            </h2>
            
            <Carousel
              opts={{
                align: "start",
                loop: stampCards.length > 1,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {stampCards.map((card) => {
                  const isInactive = card.is_completed || card.has_redeemed_reward;
                  const isCompleted = card.is_completed && !card.has_redeemed_reward;
                  
                  return (
                    <CarouselItem key={card.id} className="pl-2 md:pl-4 basis-full sm:basis-[85%] md:basis-[45%] lg:basis-[35%]">
                      <Card className={`overflow-hidden h-full transition-all duration-300 ${isCompleted ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-lg'}`}>
                        {/* Business Header */}
                        <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                          <div className="flex items-center gap-3">
                            {card.business.logo_url ? (
                              <img
                                src={card.business.logo_url}
                                alt={card.business.business_name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                                <Coffee className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold truncate">{card.business.business_name}</h3>
                              <p className="text-xs text-muted-foreground truncate">{card.business.address}</p>
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className={`p-4 ${isInactive ? 'opacity-70' : ''}`}>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold">
                              {card.stamps_collected} / {card.loyalty_program.stamps_required} stamps
                            </p>
                            {card.has_redeemed_reward && (
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                                ✓ Redeemed
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full animate-pulse">
                                🎉 Ready!
                              </span>
                            )}
                          </div>

                          <Progress
                            value={(card.stamps_collected / card.loyalty_program.stamps_required) * 100}
                            className="h-2 mb-4"
                          />

                          {/* Stamp visualization */}
                          <div className="flex gap-1.5 mb-4 flex-wrap justify-center">
                            {Array.from({ length: card.loyalty_program.stamps_required }).map((_, i) => {
                              const isCollected = i < card.stamps_collected;
                              return (
                                <div
                                  key={i}
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                                    isCollected
                                      ? isInactive 
                                        ? "bg-muted border-muted-foreground/30 text-muted-foreground"
                                        : "bg-primary border-primary/50 text-white"
                                      : "border-muted-foreground/20 text-muted-foreground/30"
                                  }`}
                                >
                                  {isCollected ? "☕" : ""}
                                </div>
                              );
                            })}
                          </div>

                          <div className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                            isInactive 
                              ? 'bg-muted/50 text-muted-foreground' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            <Gift className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium truncate">{card.loyalty_program.reward_description}</span>
                          </div>
                        </div>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              {stampCards.length > 1 && (
                <>
                  <CarouselPrevious className="hidden sm:flex -left-4" />
                  <CarouselNext className="hidden sm:flex -right-4" />
                </>
              )}
            </Carousel>
            
            {stampCards.length > 1 && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Swipe to see more cards
              </p>
            )}
          </div>
        )}

        {/* Explore Shops Section */}
        {exploreShops.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              Explore Shops
            </h2>
            
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {exploreShops.map((shop) => (
                <Card 
                  key={shop.id} 
                  className="p-4 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate("/customer/scan")}
                >
                  <div className="flex items-center gap-3">
                    {shop.logo_url ? (
                      <img
                        src={shop.logo_url}
                        alt={shop.business_name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-border group-hover:border-primary/50 transition-colors"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                        <Coffee className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {shop.business_name}
                      </h3>
                      {shop.address && (
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {shop.address}
                        </p>
                      )}
                      {shop.loyalty_program && (
                        <p className="text-xs text-primary mt-1">
                          🎁 {shop.loyalty_program.reward_description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Scan Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={() => navigate("/customer/scan")}
          size="lg"
          className="h-14 px-6 text-base rounded-full shadow-2xl hover:scale-105 transition-all"
        >
          <QrCode className="mr-2 w-5 h-5" />
          Scan QR Code
        </Button>
      </div>
    </div>
  );
}

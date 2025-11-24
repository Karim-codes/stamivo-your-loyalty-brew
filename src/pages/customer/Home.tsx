import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QrCode, ArrowRight, Gift, Coffee, User, LogOut } from "lucide-react";
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

interface StampCard {
  id: string;
  stamps_collected: number;
  is_completed: boolean;
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

export default function CustomerHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [stampCards, setStampCards] = useState<StampCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStampCards();
    }
    
    // Show notification if coming from scan
    if (location.state?.newStamp) {
      toast.success("Stamp added to your card! ☕", {
        description: "Keep collecting to earn your reward!",
      });
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

          return {
            id: card.id,
            stamps_collected: card.stamps_collected,
            is_completed: card.is_completed,
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
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Shops */}
      <div className="container mx-auto px-4 py-6 space-y-4">
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
          stampCards.map((card) => (
            <Card
              key={card.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate("/customer/rewards")}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-start">
                  {card.business.logo_url ? (
                    <img
                      src={card.business.logo_url}
                      alt={card.business.business_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Coffee className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold mb-1">{card.business.business_name}</h3>
                    <p className="text-xs text-muted-foreground">{card.business.address}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {card.stamps_collected} / {card.loyalty_program.stamps_required} stamps
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>

              <Progress
                value={(card.stamps_collected / card.loyalty_program.stamps_required) * 100}
                className="h-3 mb-4"
              />

              {/* Stamp visualization */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {Array.from({ length: card.loyalty_program.stamps_required }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg transition-all ${
                      i < card.stamps_collected
                        ? "bg-primary border-primary text-primary-foreground animate-in zoom-in"
                        : "border-muted text-muted"
                    }`}
                  >
                    {i < card.stamps_collected ? "☕" : ""}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm bg-success/10 text-success p-3 rounded-lg">
                <Gift className="w-4 h-4" />
                <span className="font-medium">{card.loyalty_program.reward_description}</span>
              </div>

              {card.is_completed && (
                <div className="mt-3 text-center">
                  <span className="inline-block bg-success text-success-foreground px-4 py-2 rounded-full text-sm font-medium">
                    🎉 Ready to redeem!
                  </span>
                </div>
              )}
            </Card>
          ))
        )}
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

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, Clock, CheckCircle2, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { FeedbackDialog } from "@/components/FeedbackDialog";

interface CompletedCard {
  id: string;
  stamps_collected: number;
  completed_at: string;
  business: {
    id: string;
    business_name: string;
    logo_url: string | null;
  };
  loyalty_program: {
    stamps_required: number;
    reward_description: string;
  };
}

interface RedemptionCode {
  id: string;
  redemption_code: string;
  code_expires_at: string;
  is_redeemed: boolean;
  redeemed_at: string | null;
  business_id: string;
  business_name: string;
}

export default function Redeem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedCards, setCompletedCards] = useState<CompletedCard[]>([]);
  const [redemptionCodes, setRedemptionCodes] = useState<RedemptionCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    businessName: string;
    businessId: string;
    redemptionId: string;
  }>({
    open: false,
    businessName: "",
    businessId: "",
    redemptionId: "",
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Real-time listener for redemption updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('redemption-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rewards_redeemed',
          filter: `customer_id=eq.${user.id}`
        },
        (payload) => {
          const newData = payload.new as any;
          const oldData = payload.old as any;
          if (newData.is_redeemed && !oldData.is_redeemed) {
            // Reward was just redeemed
            toast.success("🎉 Your reward has been redeemed!", {
              description: "The barista has verified and redeemed your reward.",
              duration: 6000
            });
            
            // Find the business name for feedback
            const code = redemptionCodes.find(c => c.id === newData.id);
            if (code) {
              // Open feedback dialog after a short delay
              setTimeout(() => {
                setFeedbackDialog({
                  open: true,
                  businessName: code.business_name,
                  businessId: code.business_id,
                  redemptionId: newData.id,
                });
              }, 1000);
            }
            
            fetchData(); // Refresh the list
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch completed stamp cards
      const { data: cardsData, error: cardsError } = await supabase
        .from('stamp_cards')
        .select(`
          id,
          stamps_collected,
          completed_at,
          businesses!inner (
            id,
            business_name,
            logo_url
          )
        `)
        .eq('customer_id', user.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false });

      if (cardsError) throw cardsError;

      // Fetch loyalty programs
      const cardsWithPrograms = await Promise.all(
        (cardsData || []).map(async (card: any) => {
          const { data: programData } = await supabase
            .from('loyalty_programs')
            .select('stamps_required, reward_description')
            .eq('business_id', card.businesses.id)
            .eq('is_active', true)
            .maybeSingle();

          return {
            id: card.id,
            stamps_collected: card.stamps_collected,
            completed_at: card.completed_at,
            business: {
              id: card.businesses.id,
              business_name: card.businesses.business_name,
              logo_url: card.businesses.logo_url
            },
            loyalty_program: programData || { stamps_required: 10, reward_description: 'Free item' }
          };
        })
      );

      setCompletedCards(cardsWithPrograms);

      // Fetch redemption codes
      const { data: codesData, error: codesError } = await supabase
        .from('rewards_redeemed')
        .select(`
          id,
          redemption_code,
          code_expires_at,
          is_redeemed,
          redeemed_at,
          business_id,
          businesses!inner (
            business_name
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (codesError) throw codesError;

      const formattedCodes = (codesData || []).map((code: any) => ({
        id: code.id,
        redemption_code: code.redemption_code,
        code_expires_at: code.code_expires_at,
        is_redeemed: code.is_redeemed,
        redeemed_at: code.redeemed_at,
        business_id: code.business_id,
        business_name: code.businesses.business_name
      }));

      setRedemptionCodes(formattedCodes);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  const generateRedemptionCode = async (stampCardId: string, businessId: string) => {
    if (!user) return;

    setGenerating(stampCardId);

    try {
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Code expires in 15 minutes
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      const { error } = await supabase
        .from('rewards_redeemed')
        .insert({
          customer_id: user.id,
          business_id: businessId,
          stamp_card_id: stampCardId,
          redemption_code: code,
          code_expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      toast.success("Redemption code generated!", {
        description: "Show this code to the business to claim your reward"
      });

      // Refresh data
      await fetchData();
    } catch (error: any) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate redemption code");
    } finally {
      setGenerating(null);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const isCodeExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          onClick={() => navigate("/customer")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Redeem Rewards</h1>
          <p className="text-muted-foreground">
            Claim your completed stamp cards for rewards
          </p>
        </div>

        {/* Active Redemption Codes */}
        {redemptionCodes.some(code => !code.is_redeemed && !isCodeExpired(code.code_expires_at)) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Codes</h2>
            <div className="space-y-4">
              {redemptionCodes
                .filter(code => !code.is_redeemed && !isCodeExpired(code.code_expires_at))
                .map((code) => (
                  <Card key={code.id} className="p-6 border-2 border-primary">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{code.business_name}</h3>
                        <Badge variant="default" className="mt-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Expires {format(new Date(code.code_expires_at), 'p')}
                        </Badge>
                      </div>
                      <Gift className="w-8 h-8 text-primary" />
                    </div>
                    
                    <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Redemption Code</p>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-4xl font-bold tracking-wider font-mono">
                            {code.redemption_code}
                          </p>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(code.redemption_code)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground text-center">
                      Show this code to the business staff to claim your reward
                    </p>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Completed Cards Available for Redemption */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
          {completedCards.length === 0 ? (
            <Card className="p-8 text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">No rewards available yet</p>
              <p className="text-sm text-muted-foreground">
                Complete stamp cards to unlock rewards
              </p>
              <Button 
                onClick={() => navigate("/customer")} 
                className="mt-4"
              >
                View Stamp Cards
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedCards.map((card) => {
                const hasActiveCode = redemptionCodes.some(
                  code => code.business_id === card.business.id && 
                          !code.is_redeemed && 
                          !isCodeExpired(code.code_expires_at)
                );

                return (
                  <Card key={card.id} className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {card.business.logo_url ? (
                        <img 
                          src={card.business.logo_url} 
                          alt={card.business.business_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Gift className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{card.business.business_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {card.loyalty_program.reward_description}
                        </p>
                      </div>
                    </div>

                    <div className="bg-success/10 rounded-lg p-3 mb-4 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="text-sm font-medium text-success">
                        {card.stamps_collected}/{card.loyalty_program.stamps_required} stamps completed
                      </span>
                    </div>

                    <Button
                      onClick={() => generateRedemptionCode(card.id, card.business.id)}
                      disabled={generating === card.id || hasActiveCode}
                      className="w-full"
                    >
                      {generating === card.id ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating...
                        </span>
                      ) : hasActiveCode ? (
                        "Code Already Generated"
                      ) : (
                        "Generate Redemption Code"
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Completed {format(new Date(card.completed_at), 'PPP')}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Redeemed Codes History */}
        {redemptionCodes.some(code => code.is_redeemed) && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Redeemed Rewards</h2>
            <div className="space-y-3">
              {redemptionCodes
                .filter(code => code.is_redeemed)
                .map((code) => (
                  <Card key={code.id} className="p-4 opacity-60">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{code.business_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Redeemed {code.redeemed_at && format(new Date(code.redeemed_at), 'PPp')}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Redeemed
                      </Badge>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackDialog.open}
        onOpenChange={(open) =>
          setFeedbackDialog((prev) => ({ ...prev, open }))
        }
        businessName={feedbackDialog.businessName}
        businessId={feedbackDialog.businessId}
        redemptionId={feedbackDialog.redemptionId}
      />
    </div>
  );
}

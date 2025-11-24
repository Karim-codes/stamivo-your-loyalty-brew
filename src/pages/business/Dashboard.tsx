import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Coffee, Gift, TrendingUp, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardStats {
  totalCustomers: number;
  stampsGiven: number;
  rewardsRedeemed: number;
  growthRate: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    stampsGiven: 0,
    rewardsRedeemed: 0,
    growthRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      if (!user) return;

      // Get business ID for the current user (get first business if multiple exist)
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);

      if (!businesses || businesses.length === 0) {
        toast.error("Business not found");
        return;
      }

      const business = businesses[0];

      // Get total unique customers
      const { data: customers, error: customersError } = await supabase
        .from('stamp_cards')
        .select('customer_id')
        .eq('business_id', business.id);

      if (customersError) throw customersError;

      const uniqueCustomers = new Set(customers?.map(c => c.customer_id) || []).size;

      // Get total stamps given
      const { data: stampCards, error: stampsError } = await supabase
        .from('stamp_cards')
        .select('stamps_collected')
        .eq('business_id', business.id);

      if (stampsError) throw stampsError;

      const totalStamps = stampCards?.reduce((sum, card) => sum + card.stamps_collected, 0) || 0;

      // Get total rewards redeemed
      const { data: rewards, error: rewardsError } = await supabase
        .from('rewards_redeemed')
        .select('id')
        .eq('business_id', business.id)
        .eq('is_redeemed', true);

      if (rewardsError) throw rewardsError;

      const totalRewards = rewards?.length || 0;

      // Calculate growth (compare last 7 days vs previous 7 days)
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const { data: recentTransactions } = await supabase
        .from('stamp_transactions')
        .select('id')
        .eq('business_id', business.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      const { data: previousTransactions } = await supabase
        .from('stamp_transactions')
        .select('id')
        .eq('business_id', business.id)
        .gte('created_at', fourteenDaysAgo.toISOString())
        .lt('created_at', sevenDaysAgo.toISOString());

      const recentCount = recentTransactions?.length || 0;
      const previousCount = previousTransactions?.length || 1; // Avoid division by zero
      const growthRate = Math.round(((recentCount - previousCount) / previousCount) * 100);

      setStats({
        totalCustomers: uniqueCustomers,
        stampsGiven: totalStamps,
        rewardsRedeemed: totalRewards,
        growthRate: growthRate,
      });
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Business Dashboard</h1>
            <p className="text-muted-foreground">Welcome back!</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/business/verify")} variant="outline" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Verify Rewards
            </Button>
            <Button onClick={() => navigate("/business/qr-code")} className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              View QR Code
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stamps Given</p>
                    <p className="text-2xl font-bold">{stats.stampsGiven}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rewards Redeemed</p>
                    <p className="text-2xl font-bold">{stats.rewardsRedeemed}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-caramel/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-caramel" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth (7 days)</p>
                    <p className="text-2xl font-bold">
                      {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <p className="text-muted-foreground text-center py-8">
                Activity feed coming soon! Track customer visits, stamp transactions, and reward redemptions in real-time.
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

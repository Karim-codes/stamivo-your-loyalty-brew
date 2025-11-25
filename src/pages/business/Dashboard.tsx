import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Coffee, Gift, TrendingUp, QrCode, Clock, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardStats {
  totalCustomers: number;
  stampsGiven: number;
  rewardsRedeemed: number;
  growthRate: number;
}

interface RecentActivity {
  id: string;
  type: 'stamp' | 'redemption';
  customerName: string;
  timestamp: string;
  description: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState<string>("Business Dashboard");
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    stampsGiven: 0,
    rewardsRedeemed: 0,
    growthRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
      fetchRecentActivity();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      if (!user) return;

      // Get business ID and name for the current user
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id, business_name')
        .eq('owner_id', user.id)
        .limit(1);

      if (!businesses || businesses.length === 0) {
        toast.error("Business not found");
        return;
      }

      const business = businesses[0];
      setBusinessName(business.business_name);

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

  const fetchRecentActivity = async () => {
    try {
      if (!user) return;

      // Get business ID
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);

      if (!businesses || businesses.length === 0) return;

      const businessId = businesses[0].id;

      // Fetch recent stamp transactions with customer profiles
      const { data: transactions } = await supabase
        .from('stamp_transactions')
        .select(`
          id,
          created_at,
          customer_id,
          profiles!stamp_transactions_customer_id_fkey (
            full_name,
            email
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent redemptions with customer profiles (ONLY redeemed ones)
      const { data: redemptions } = await supabase
        .from('rewards_redeemed')
        .select(`
          id,
          redeemed_at,
          customer_id,
          profiles!rewards_redeemed_customer_id_fkey (
            full_name,
            email
          )
        `)
        .eq('business_id', businessId)
        .eq('is_redeemed', true)
        .not('redeemed_at', 'is', null)
        .order('redeemed_at', { ascending: false })
        .limit(10);

      // Combine and format activities
      const activities: RecentActivity[] = [];

      redemptions?.forEach((r: any) => {
        activities.push({
          id: r.id,
          type: 'redemption',
          customerName: r.profiles?.full_name || r.profiles?.email?.split('@')[0] || 'Customer',
          timestamp: r.redeemed_at,
          description: 'redeemed a reward'
        });
      });

      // Sort by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities);

    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{businessName}</h1>
            <p className="text-muted-foreground">Welcome back!</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button onClick={() => navigate("/business/analytics")} variant="outline" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </Button>
            <Button onClick={() => navigate("/business/verify")} variant="outline" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Verify Rewards
            </Button>
            <Button onClick={() => navigate("/business/qr-code")} className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              View QR Code
            </Button>
            
            {/* Profile/Logout Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Users className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Business Account</p>
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
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No recent activity yet. Once customers start collecting stamps, you'll see their activity here.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'stamp' 
                          ? 'bg-primary/20' 
                          : 'bg-success/20'
                      }`}>
                        {activity.type === 'stamp' ? (
                          <Coffee className="w-5 h-5 text-primary" />
                        ) : (
                          <Gift className="w-5 h-5 text-success" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          <span className="text-foreground">{activity.customerName}</span>
                          {' '}
                          <span className="text-muted-foreground">{activity.description}</span>
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

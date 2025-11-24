import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Coffee, Gift, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface AnalyticsData {
  totalCustomers: number;
  totalStamps: number;
  totalRedemptions: number;
  activeCards: number;
  completedCards: number;
  dailyStats: {
    date: string;
    stamps: number;
    redemptions: number;
  }[];
}

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCustomers: 0,
    totalStamps: 0,
    totalRedemptions: 0,
    activeCards: 0,
    completedCards: 0,
    dailyStats: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      // Get business ID
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!business) return;

      // Get total unique customers
      const { data: customers } = await supabase
        .from('stamp_cards')
        .select('customer_id')
        .eq('business_id', business.id);

      const uniqueCustomers = new Set(customers?.map(c => c.customer_id) || []).size;

      // Get stamp cards stats
      const { data: activeCards } = await supabase
        .from('stamp_cards')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_completed', false);

      const { data: completedCards } = await supabase
        .from('stamp_cards')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_completed', true);

      // Calculate total stamps
      const totalStamps = [...(activeCards || []), ...(completedCards || [])]
        .reduce((sum, card) => sum + card.stamps_collected, 0);

      // Get redemptions
      const { data: redemptions } = await supabase
        .from('rewards_redeemed')
        .select('*')
        .eq('business_id', business.id);

      // Get daily stats for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const dailyStats = await Promise.all(
        last7Days.map(async (date) => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);

          const { data: dayTransactions } = await supabase
            .from('stamp_transactions')
            .select('*')
            .eq('business_id', business.id)
            .gte('scanned_at', date)
            .lt('scanned_at', nextDay.toISOString().split('T')[0]);

          const { data: dayRedemptions } = await supabase
            .from('rewards_redeemed')
            .select('*')
            .eq('business_id', business.id)
            .gte('created_at', date)
            .lt('created_at', nextDay.toISOString().split('T')[0]);

          return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            stamps: dayTransactions?.length || 0,
            redemptions: dayRedemptions?.length || 0
          };
        })
      );

      setAnalytics({
        totalCustomers: uniqueCustomers,
        totalStamps,
        totalRedemptions: redemptions?.length || 0,
        activeCards: activeCards?.length || 0,
        completedCards: completedCards?.length || 0,
        dailyStats
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          onClick={() => navigate("/business")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Business Analytics</h1>
          <p className="text-muted-foreground">
            Track your loyalty program performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{analytics.totalCustomers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Coffee className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stamps</p>
                <p className="text-2xl font-bold">{analytics.totalStamps}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Gift className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Redemptions</p>
                <p className="text-2xl font-bold">{analytics.totalRedemptions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Cards</p>
                <p className="text-2xl font-bold">{analytics.activeCards}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stamps Collected (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="stamps" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Stamps"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Redemptions (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="redemptions" 
                  fill="hsl(var(--success))"
                  name="Redemptions"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Additional Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Card Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Active Cards</span>
                <span className="font-semibold">{analytics.activeCards}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ 
                    width: `${(analytics.activeCards / (analytics.activeCards + analytics.completedCards)) * 100}%` 
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Completed Cards</span>
                <span className="font-semibold">{analytics.completedCards}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success"
                  style={{ 
                    width: `${(analytics.completedCards / (analytics.activeCards + analytics.completedCards)) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

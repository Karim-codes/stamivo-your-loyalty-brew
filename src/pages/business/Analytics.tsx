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
  approvalRate: number;
  rejectionRate: number;
  avgApprovalTime: number;
  totalApproved: number;
  totalRejected: number;
  totalPending: number;
  dailyStats: {
    date: string;
    stamps: number;
    redemptions: number;
  }[];
  hourlyRequests: {
    hour: number;
    count: number;
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
    approvalRate: 0,
    rejectionRate: 0,
    avgApprovalTime: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalPending: 0,
    dailyStats: [],
    hourlyRequests: []
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

      // Get stamp transaction statistics for approval analytics
      const { data: allTransactions } = await supabase
        .from('stamp_transactions')
        .select('*')
        .eq('business_id', business.id);

      const approvedTransactions = allTransactions?.filter(t => t.status === 'verified') || [];
      const rejectedTransactions = allTransactions?.filter(t => t.status === 'rejected') || [];
      const pendingTransactions = allTransactions?.filter(t => t.status === 'pending') || [];

      const totalApproved = approvedTransactions.length;
      const totalRejected = rejectedTransactions.length;
      const totalPending = pendingTransactions.length;
      const totalProcessed = totalApproved + totalRejected;

      const approvalRate = totalProcessed > 0 ? (totalApproved / totalProcessed) * 100 : 0;
      const rejectionRate = totalProcessed > 0 ? (totalRejected / totalProcessed) * 100 : 0;

      // Calculate average approval time
      let totalApprovalTime = 0;
      let approvalCount = 0;

      approvedTransactions.forEach(transaction => {
        const createdAt = new Date(transaction.created_at);
        const scannedAt = new Date(transaction.scanned_at);
        const timeDiff = (createdAt.getTime() - scannedAt.getTime()) / (1000 * 60);
        if (timeDiff >= 0 && timeDiff < 1440) {
          totalApprovalTime += timeDiff;
          approvalCount++;
        }
      });

      const avgApprovalTime = approvalCount > 0 ? totalApprovalTime / approvalCount : 0;

      // Calculate hourly distribution
      const hourlyMap = new Map<number, number>();
      for (let i = 0; i < 24; i++) {
        hourlyMap.set(i, 0);
      }

      allTransactions?.forEach(transaction => {
        const hour = new Date(transaction.created_at).getHours();
        hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
      });

      const hourlyRequests = Array.from(hourlyMap.entries())
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => a.hour - b.hour);

      setAnalytics({
        totalCustomers: uniqueCustomers,
        totalStamps,
        totalRedemptions: redemptions?.length || 0,
        activeCards: activeCards?.length || 0,
        completedCards: completedCards?.length || 0,
        approvalRate,
        rejectionRate,
        avgApprovalTime,
        totalApproved,
        totalRejected,
        totalPending,
        dailyStats,
        hourlyRequests
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

        {/* Approval Analytics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Approval Rate</h3>
            <p className="text-3xl font-bold text-success mb-1">
              {analytics.approvalRate.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">
              {analytics.totalApproved} approved
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Rejection Rate</h3>
            <p className="text-3xl font-bold text-destructive mb-1">
              {analytics.rejectionRate.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">
              {analytics.totalRejected} rejected
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Avg. Approval Time</h3>
            <p className="text-3xl font-bold text-primary mb-1">
              {analytics.avgApprovalTime.toFixed(1)}m
            </p>
            <p className="text-xs text-muted-foreground">
              {analytics.totalPending} pending
            </p>
          </Card>
        </div>

        {/* Peak Hours Chart */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Peak Request Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.hourlyRequests}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="hour" 
                tickFormatter={(hour) => `${hour}:00`}
                className="text-sm"
              />
              <YAxis className="text-sm" />
              <Tooltip 
                labelFormatter={(hour) => `${hour}:00 - ${hour + 1}:00`}
                formatter={(value) => [`${value} requests`, 'Requests']}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--primary))" 
                radius={[8, 8, 0, 0]}
                name="Requests"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

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

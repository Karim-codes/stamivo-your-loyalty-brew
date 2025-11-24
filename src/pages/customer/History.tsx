import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Coffee, Gift, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface Transaction {
  id: string;
  scanned_at: string;
  business_name: string;
  status: string;
}

interface Redemption {
  id: string;
  created_at: string;
  redeemed_at: string | null;
  business_name: string;
  redemption_code: string;
  is_redeemed: boolean;
}

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      // Fetch stamp transactions
      const { data: transData, error: transError } = await supabase
        .from('stamp_transactions')
        .select(`
          id,
          scanned_at,
          status,
          business_id,
          businesses (
            business_name
          )
        `)
        .eq('customer_id', user.id)
        .order('scanned_at', { ascending: false })
        .limit(50);

      if (transError) throw transError;

      const formattedTransactions = transData?.map(t => ({
        id: t.id,
        scanned_at: t.scanned_at,
        business_name: (t.businesses as any)?.business_name || 'Unknown Business',
        status: t.status
      })) || [];

      // Fetch redemptions
      const { data: redeemData, error: redeemError } = await supabase
        .from('rewards_redeemed')
        .select(`
          id,
          created_at,
          redeemed_at,
          redemption_code,
          is_redeemed,
          business_id,
          businesses (
            business_name
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (redeemError) throw redeemError;

      const formattedRedemptions = redeemData?.map(r => ({
        id: r.id,
        created_at: r.created_at,
        redeemed_at: r.redeemed_at,
        business_name: (r.businesses as any)?.business_name || 'Unknown Business',
        redemption_code: r.redemption_code,
        is_redeemed: r.is_redeemed
      })) || [];

      setTransactions(formattedTransactions);
      setRedemptions(formattedRedemptions);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading history...</p>
        </div>
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
          <h1 className="text-3xl font-bold mb-2">My History</h1>
          <p className="text-muted-foreground">
            View all your stamps and redemptions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Coffee className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stamps</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Gift className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rewards</p>
                <p className="text-2xl font-bold">{redemptions.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stamps History */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Stamp History
          </h2>
          {transactions.length === 0 ? (
            <Card className="p-8 text-center">
              <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No stamps collected yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start scanning QR codes to earn stamps!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Coffee className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.business_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.scanned_at), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'verified' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Redemptions History */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Redemption History
          </h2>
          {redemptions.length === 0 ? (
            <Card className="p-8 text-center">
              <Gift className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No rewards redeemed yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your stamp cards to earn rewards!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {redemptions.map((redemption) => (
                <Card key={redemption.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        redemption.is_redeemed ? 'bg-success/10' : 'bg-warning/10'
                      }`}>
                        <Gift className={`w-5 h-5 ${
                          redemption.is_redeemed ? 'text-success' : 'text-warning'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{redemption.business_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Code: {redemption.redemption_code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {redemption.is_redeemed && redemption.redeemed_at
                            ? `Redeemed: ${format(new Date(redemption.redeemed_at), 'MMM d, yyyy • h:mm a')}`
                            : `Generated: ${format(new Date(redemption.created_at), 'MMM d, yyyy • h:mm a')}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        redemption.is_redeemed 
                          ? 'bg-success/20 text-success' 
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {redemption.is_redeemed ? 'Redeemed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

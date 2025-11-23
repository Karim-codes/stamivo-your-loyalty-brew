import { Card } from "@/components/ui/card";
import { Users, Coffee, Gift, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Business Dashboard</h1>
          <p className="text-muted-foreground">Welcome back!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">1,234</p>
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
                <p className="text-2xl font-bold">3,456</p>
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
                <p className="text-2xl font-bold">234</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-caramel/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-caramel" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="text-2xl font-bold">+23%</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            This is a placeholder dashboard. Full functionality coming soon!
          </p>
        </Card>
      </div>
    </div>
  );
}

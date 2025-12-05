import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Coffee } from "lucide-react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, 'customer', fullName);
      if (error) {
        toast.error(error.message);
        setLoading(false);
      } else {
        toast.success("Account created! Please check your email to verify.");
        // Wait a bit for role to be assigned
        setTimeout(() => {
          navigate("/customer");
          setLoading(false);
        }, 500);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      
      toast.success("Welcome back!");
      
      // Wait for auth state to update before checking role and redirecting
      setTimeout(async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (roleData?.role === 'business') {
              navigate("/business/dashboard");
            } else {
              // Default to customer
              navigate("/customer");
            }
          } else {
            navigate("/customer");
          }
        } catch (err) {
          console.error('Error checking role:', err);
          navigate("/customer");
        }
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7EEDB] to-[#E5A36F]/20 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Coffee className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Start earning free coffee today" : "Sign in to continue earning rewards"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

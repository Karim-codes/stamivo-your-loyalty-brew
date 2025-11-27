import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, User, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CustomerProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFullName(data.full_name || "");
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          email: user.email,
        });

      if (error) throw error;

      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    setResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast.success("Password reset email sent!", {
        description: "Check your inbox for the reset link."
      });
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setResettingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pb-8">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/customer")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nickname / Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This is how shops will see you
                </p>
              </div>
              
              <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Email (Read-only) */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Email Address</h2>
            </div>
            
            <div>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>
          </Card>

          {/* Password Reset */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Password</h2>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Need to change your password? We'll send a reset link to your email.
              </p>
              <Button 
                variant="outline" 
                onClick={handleResetPassword} 
                disabled={resettingPassword}
                className="w-full"
              >
                {resettingPassword ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2" />
                )}
                Send Password Reset Email
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'business' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }

      // Get user's actual role
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data && !error) {
        setUserRole(data.role);
        setHasRole(requiredRole ? data.role === requiredRole : true);
      } else {
        setUserRole(null);
        setHasRole(false);
      }
      
      setCheckingRole(false);
    };

    if (!loading) {
      checkRole();
    }
  }, [user, loading, requiredRole]);

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && hasRole === false) {
    // Redirect based on user's actual role
    if (userRole === 'business') {
      return <Navigate to="/business/dashboard" replace />;
    } else if (userRole === 'customer') {
      return <Navigate to="/customer" replace />;
    }
    // No role found - redirect to auth
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

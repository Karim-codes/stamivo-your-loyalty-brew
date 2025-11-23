import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import CustomerHome from "./pages/customer/Home";
import Scan from "./pages/customer/Scan";
import Rewards from "./pages/customer/Rewards";
import Onboarding from "./pages/business/Onboarding";
import Dashboard from "./pages/business/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/customer" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerHome />
              </ProtectedRoute>
            } />
            <Route path="/customer/scan" element={
              <ProtectedRoute requiredRole="customer">
                <Scan />
              </ProtectedRoute>
            } />
            <Route path="/customer/rewards" element={
              <ProtectedRoute requiredRole="customer">
                <Rewards />
              </ProtectedRoute>
            } />
            <Route path="/business/onboarding" element={<Onboarding />} />
            <Route path="/business/dashboard" element={
              <ProtectedRoute requiredRole="business">
                <Dashboard />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

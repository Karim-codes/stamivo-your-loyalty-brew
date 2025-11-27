import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Auth from "./pages/Auth";
import CustomerHome from "./pages/customer/Home";
import Scan from "./pages/customer/Scan";
import Rewards from "./pages/customer/Rewards";
import Redeem from "./pages/customer/Redeem";
import History from "./pages/customer/History";
import CustomerProfile from "./pages/customer/Profile";
import Onboarding from "./pages/business/Onboarding";
import Dashboard from "./pages/business/Dashboard";
import QRCodePage from "./pages/business/QRCode";
import VerifyRedemption from "./pages/business/VerifyRedemption";
import Analytics from "./pages/business/Analytics";
import BusinessProfile from "./pages/business/Profile";
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
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
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
            <Route path="/customer/redeem" element={
              <ProtectedRoute requiredRole="customer">
                <Redeem />
              </ProtectedRoute>
            } />
            <Route path="/customer/history" element={
              <ProtectedRoute requiredRole="customer">
                <History />
              </ProtectedRoute>
            } />
            <Route path="/business/onboarding" element={<Onboarding />} />
            <Route path="/business/dashboard" element={
              <ProtectedRoute requiredRole="business">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/business/qr-code" element={
              <ProtectedRoute requiredRole="business">
                <QRCodePage />
              </ProtectedRoute>
            } />
            <Route path="/business/verify" element={
              <ProtectedRoute requiredRole="business">
                <VerifyRedemption />
              </ProtectedRoute>
            } />
            <Route path="/business/analytics" element={
              <ProtectedRoute requiredRole="business">
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/business/profile" element={
              <ProtectedRoute requiredRole="business">
                <BusinessProfile />
              </ProtectedRoute>
            } />
            <Route path="/customer/profile" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerProfile />
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

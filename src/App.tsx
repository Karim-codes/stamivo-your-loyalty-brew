import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CustomerHome from "./pages/customer/Home";
import Scan from "./pages/customer/Scan";
import Rewards from "./pages/customer/Rewards";
import Onboarding from "./pages/business/Onboarding";
import Dashboard from "./pages/business/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/customer/scan" element={<Scan />} />
          <Route path="/customer/rewards" element={<Rewards />} />
          <Route path="/business/onboarding" element={<Onboarding />} />
          <Route path="/business/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

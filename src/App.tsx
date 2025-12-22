import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { MobileContainer } from "@/components/layout/MobileContainer";

// Pages
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Decisions from "./pages/Decisions";
import Simulations from "./pages/Simulations";
import Chat from "./pages/Chat";
import Goals from "./pages/Goals";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isOnboarded } = useApp();

  return (
    <Routes>
      <Route 
        path="/" 
        element={isOnboarded ? <Navigate to="/dashboard" replace /> : <Welcome />} 
      />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route 
        path="/dashboard" 
        element={isOnboarded ? <Dashboard /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/decisions" 
        element={isOnboarded ? <Decisions /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/simulations" 
        element={isOnboarded ? <Simulations /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/chat" 
        element={isOnboarded ? <Chat /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/goals" 
        element={isOnboarded ? <Goals /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/rewards" 
        element={isOnboarded ? <Rewards /> : <Navigate to="/" replace />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MobileContainer showStatusBar={false}>
            <AppRoutes />
          </MobileContainer>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

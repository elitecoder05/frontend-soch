import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import NetworkStatus from "@/components/NetworkStatus";

// Import network debugging utilities (makes functions available in console)
import "@/utils/networkUtils";

// Pages
import Home from "./pages/Home";
import { LandingPage } from "./pages/LandingPage"; // Point #1 & #3
import { SearchPage } from "./pages/SearchPage";   // Point #6
import ModelDetail from "./pages/ModelDetail";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import UploadModel from "./pages/UploadModel";
import NotFound from "./pages/NotFound";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import PricingPage from "./pages/PricingPage";
import RefundPolicy from "./pages/RefundPolicy";
import DataSafety from "./pages/DataSafety";
import Contact from "./pages/Contact";
import Explorer from "./pages/Explorer";
// LaunchPage removed - using UploadModel instead
import PaymentFailure from "./pages/PaymentFailure";
import { GetFeaturedPage } from "./pages/GetFeaturedPage";
import { PromotePage } from "./pages/PromotePage";
import SochAIApps from "./pages/SochAIApps";
import { SubmitToolLanding } from "./pages/SubmitToolLanding";
import ScriptGeneratorPage from "../frontend-script/pages/ScriptGeneratorPage";
// Components
import { MobileNav } from "./components/MobileNav";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes cache time
      refetchOnWindowFocus: false,
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
  },
});

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Array of roles allowed to access this route
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const location = useLocation();

  // 1. Show Loading Spinner while AuthContext fetches profile
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Check if User is Logged In
  if (!isAuthenticated || !currentUser) {
    // Redirect to login, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check for Role Permission (Optional)
  // If allowedRoles is provided, ensure the user has one of them
  if (allowedRoles && !allowedRoles.includes(currentUser.role || '')) {
    // If Admin-only route and user is "user", redirect to Home
    return <Navigate to="/" replace />;
  }

  // 4. Access Granted
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Landing Page Route (Point #3) */}
            <Route path="/intro" element={<LandingPage />} />

            {/* Main Application Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} /> {/* Point #6: Play Store style search */}
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/model/:id" element={<ModelDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryDetail />} />
            
            <Route path="/submit-tool" element={<SubmitToolLanding />} />
            <Route path="/upload-model" element={<UploadModel />} />
            <Route path="/profile" element={<Profile />} />
         
            {/* Auth & Static Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/subscription-plans" element={<SubscriptionPlans />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/data-safety" element={<DataSafety />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payment-failed" element={<PaymentFailure />} />
            <Route path="/get-featured" element={<GetFeaturedPage />} />
            <Route path="/promote" element={<PromotePage />} />
            <Route path="/soch-ai-apps" element={<SochAIApps />} />
            <Route path="/script-generator" element={<ScriptGeneratorPage />} />
            {/* Admin Route */}
            <Route path="/admin" element={ 
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin/>
              </ProtectedRoute>
            } />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Mobile Bottom Navigation (Handles its own visibility) */}
          {/* <MobileNav /> */}
          
          {/* Network Status Indicator */}
          <NetworkStatus />
          
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
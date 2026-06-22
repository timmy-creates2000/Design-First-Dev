import { AppLayout } from "./components/layout";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import Careers from "@/pages/careers";
import Recommendations from "@/pages/recommendations";
import CareerDetail from "@/pages/career-detail";
import Roadmap from "@/pages/roadmap";
import Chat from "@/pages/chat";
import Progress from "@/pages/progress";
import Resources from "@/pages/resources";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, path }: { component: React.ComponentType<any>, path: string }) {
  const { isAuthenticated, user } = useAuth();
  const [location, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (user && !user.onboardingComplete && path !== "/onboarding") {
    setLocation("/onboarding");
    return null;
  }

  // Use layout for internal pages, but not for onboarding
  if (path === "/onboarding") {
    return <Component />;
  }

  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function Router() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={isAuthenticated ? () => <ProtectedRoute component={Dashboard} path="/dashboard" /> : Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/onboarding">
        <ProtectedRoute component={Onboarding} path="/onboarding" />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} path="/dashboard" />
      </Route>
      <Route path="/careers">
        <ProtectedRoute component={Careers} path="/careers" />
      </Route>
      <Route path="/careers/recommendations">
        <ProtectedRoute component={Recommendations} path="/careers/recommendations" />
      </Route>
      <Route path="/careers/:id">
        <ProtectedRoute component={CareerDetail} path="/careers/:id" />
      </Route>
      <Route path="/roadmap">
        <ProtectedRoute component={Roadmap} path="/roadmap" />
      </Route>
      <Route path="/chat">
        <ProtectedRoute component={Chat} path="/chat" />
      </Route>
      <Route path="/progress">
        <ProtectedRoute component={Progress} path="/progress" />
      </Route>
      <Route path="/resources">
        <ProtectedRoute component={Resources} path="/resources" />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} path="/profile" />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} path="/settings" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
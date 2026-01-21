import { Switch, Route, Redirect } from "wouter";
import { queryClient, persister } from "./lib/queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import Home from "@/pages/Home";
import Credit from "@/pages/Credit";
import Epargne from "@/pages/Epargne";
import Solde from "@/pages/Solde";
import Contencieux from "@/pages/Contencieux";
import Performance from "@/pages/Performance";
import Corbeille from "@/pages/Corbeille";
import Add from "@/pages/Add";
import AddCredit from "@/pages/AddCredit";
import AddCompteCourant from "@/pages/AddCompteCourant";
import AddCartePointage from "@/pages/AddCartePointage";
import ClientDetails from "@/pages/ClientDetails";
import AdminAccess from "@/pages/AdminAccess";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/lib/auth";

import AgentPortfolios from "@/pages/AgentPortfolios";
import AgentPortfolioDetail from "@/pages/AgentPortfolioDetail";

function ProtectedRoute({ component: Component, path }: { component: any, path: string }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <Route path={path} component={Component} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/credit" component={Credit} />
      <ProtectedRoute path="/epargne" component={Epargne} />
      <ProtectedRoute path="/solde" component={Solde} />
      <ProtectedRoute path="/contencieux" component={Contencieux} />
      <ProtectedRoute path="/performance" component={Performance} />
      <ProtectedRoute path="/corbeille" component={Corbeille} />
      <ProtectedRoute path="/add" component={Add} />
      <ProtectedRoute path="/add/credit" component={AddCredit} />
      <ProtectedRoute path="/add/compte-courant" component={AddCompteCourant} />
      <ProtectedRoute path="/add/carte-pointage" component={AddCartePointage} />
      <ProtectedRoute path="/client/:type/:id" component={ClientDetails} />
      <ProtectedRoute path="/admin/access" component={AdminAccess} />
      <ProtectedRoute path="/agent-portfolios" component={AgentPortfolios} />
      <ProtectedRoute path="/agent-portfolio/:agentId" component={AgentPortfolioDetail} />
      <ProtectedRoute path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { useEffect } from "react";
import { SyncManager } from "@/lib/syncManager";

function App() {
  useEffect(() => {
    const handleOnline = () => {
      SyncManager.processQueue();
    };
    window.addEventListener("online", handleOnline);
    // Initial check
    if (navigator.onLine) handleOnline();
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <AuthProvider>
        <TooltipProvider>
          <div className="relative">
            <Router />
            <BottomNavWrapper />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}

function BottomNavWrapper() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <BottomNav />;
}

export default App;

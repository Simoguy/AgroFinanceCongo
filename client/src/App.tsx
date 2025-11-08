import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
import Profile from "@/pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/credit" component={Credit} />
      <Route path="/epargne" component={Epargne} />
      <Route path="/solde" component={Solde} />
      <Route path="/contencieux" component={Contencieux} />
      <Route path="/performance" component={Performance} />
      <Route path="/corbeille" component={Corbeille} />
      <Route path="/add" component={Add} />
      <Route path="/profile" component={Profile} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative">
          <Router />
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

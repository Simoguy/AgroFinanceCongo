import { useLocation } from "wouter";
import {
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Trash2,
  Bell,
  RefreshCw,
  Users,
} from "lucide-react";
import CategoryButton from "@/components/CategoryButton";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Credit, CompteCourant, CartePointage } from "@shared/schema";
import { useState, useEffect } from "react";
import { SyncManager } from "@/lib/syncManager";

import { useAuth } from "@/lib/auth";

export default function Home() {
  const [, setLocation] = useLocation();
  const [syncQueueSize, setSyncQueueSize] = useState(0);

  useEffect(() => {
    const updateQueueSize = () => {
      setSyncQueueSize(SyncManager.getQueue().length);
    };
    updateQueueSize();
    const interval = setInterval(updateQueueSize, 5000);
    return () => clearInterval(interval);
  }, []);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { data: credits = [] } = useQuery<Credit[]>({ queryKey: ["/api/credits"] });
  const { data: comptes = [] } = useQuery<CompteCourant[]>({ queryKey: ["/api/compte-courants"] });
  const { data: cartes = [] } = useQuery<CartePointage[]>({ queryKey: ["/api/carte-pointages"] });

  // Filter based on role
  const filteredCredits = isAdmin ? credits : credits.filter(c => c.agentId === user?.agentId);
  const filteredComptes = isAdmin ? comptes : comptes.filter(c => c.agentId === user?.agentId);
  const filteredCartes = isAdmin ? cartes : cartes.filter(c => c.agentId === user?.agentId);

  const activeCredits = filteredCredits.filter(c => c.status === "actif");
  const activeComptes = filteredComptes.filter(c => c.status === "actif");
  const activeCartes = filteredCartes.filter(c => c.status === "actif");
  
  const soldeCredits = filteredCredits.filter(c => c.status === "solde");
  const soldeComptes = filteredComptes.filter(c => c.status === "solde");
  const soldeCartes = filteredCartes.filter(c => c.status === "solde");

  const contentieuxCredits = filteredCredits.filter(c => c.status === "contentieux");
  const contentieuxComptes = filteredComptes.filter(c => c.status === "contentieux");
  const contentieuxCartes = filteredCartes.filter(c => c.status === "contentieux");

  const deletedCredits = filteredCredits.filter(c => c.isDeleted);
  const deletedComptes = filteredComptes.filter(c => c.isDeleted);
  const deletedCartes = filteredCartes.filter(c => c.isDeleted);

  const categories = [
    { id: "credit", icon: CreditCard, label: "Mon Portefeuille", count: activeCredits.length + activeComptes.length + activeCartes.length },
    { id: "solde", icon: CheckCircle2, label: "Soldé", count: soldeCredits.length + soldeComptes.length + soldeCartes.length },
    { id: "contencieux", icon: AlertTriangle, label: "Contencieux", count: contentieuxCredits.length + contentieuxComptes.length + contentieuxCartes.length },
  ];

  if (isAdmin) {
    categories.push(
      { id: "performance", icon: TrendingUp, label: "Performance" },
      { id: "corbeille", icon: Trash2, label: "Corbeille", count: deletedCredits.length + deletedComptes.length + deletedCartes.length },
      { id: "agent-portfolios", icon: Users, label: "Portefeuille Agent" }
    );
  }

  const totalClients = activeCredits.length + activeComptes.length + activeCartes.length;

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">
              Bonjour, {user?.name || "Agent"}
            </h1>
            <p className="text-sm text-muted-foreground">Agent ID: {user?.agentId || "---"}</p>
          </div>
          <div className="flex items-center gap-2">
            {syncQueueSize > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 animate-pulse text-orange-500 border-orange-200 bg-orange-50"
                onClick={() => SyncManager.processQueue()}
              >
                <RefreshCw className="w-4 h-4" />
                <span>{syncQueueSize} en attente</span>
              </Button>
            )}
            <Button size="icon" variant="ghost" data-testid="button-notifications">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Aperçu Rapide
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Total Crédits"
              value="0 FC"
            />
            <StatCard
              label="Clients Actifs"
              value={totalClients.toString()}
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Catégories
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                icon={category.icon}
                label={category.label}
                count={category.count}
                onClick={() => setLocation(`/${category.id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

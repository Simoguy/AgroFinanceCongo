import { useState } from "react";
import { useLocation } from "wouter";
import {
  CreditCard,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Trash2,
  Bell,
} from "lucide-react";
import CategoryButton from "@/components/CategoryButton";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [, setLocation] = useLocation();

  const categories = [
    { id: "credit", icon: CreditCard, label: "Crédit", count: 15 },
    { id: "epargne", icon: Wallet, label: "Épargne", count: 8 },
    { id: "solde", icon: CheckCircle2, label: "Soldé", count: 42 },
    { id: "contencieux", icon: AlertTriangle, label: "Contencieux", count: 3 },
    { id: "performance", icon: TrendingUp, label: "Performance" },
    { id: "corbeille", icon: Trash2, label: "Corbeille", count: 2 },
  ];

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">
              Bonjour, Lesly
            </h1>
            <p className="text-sm text-muted-foreground">Agent ID: AG-2024-001</p>
          </div>
          <Button size="icon" variant="ghost" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
          </Button>
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
              value="25,400 FC"
              trend={{ value: "12%", isPositive: true }}
            />
            <StatCard
              label="Clients Actifs"
              value="42"
              trend={{ value: "5%", isPositive: true }}
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

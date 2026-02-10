import { useState } from "react";
import { ArrowLeft, Search, CreditCard, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Credit, CompteCourant, CartePointage } from "@shared/schema";

export default function SoldePage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("credit");

  const { data: credits, isLoading: loadingCredits } = useQuery<Credit[]>({
    queryKey: ["/api/credits", { status: "solde" }],
    queryFn: async () => {
      const response = await fetch("/api/credits?status=solde");
      if (!response.ok) throw new Error("Failed to fetch credits");
      return response.json();
    },
    enabled: activeTab === "credit",
  });

  const { data: comptes, isLoading: loadingComptes } = useQuery<CompteCourant[]>({
    queryKey: ["/api/compte-courants", { status: "solde" }],
    queryFn: async () => {
      const response = await fetch("/api/compte-courants?status=solde");
      if (!response.ok) throw new Error("Failed to fetch accounts");
      return response.json();
    },
    enabled: activeTab === "epargne",
  });

  const { data: cartes, isLoading: loadingCartes } = useQuery<CartePointage[]>({
    queryKey: ["/api/carte-pointages", { status: "solde" }],
    queryFn: async () => {
      const response = await fetch("/api/carte-pointages?status=solde");
      if (!response.ok) throw new Error("Failed to fetch cards");
      return response.json();
    },
    enabled: activeTab === "epargne",
  });

  const isLoading = activeTab === "credit" ? loadingCredits : (loadingComptes || loadingCartes);
  const epargneClients = [...(comptes || []), ...(cartes || [])];
  const clients = activeTab === "credit" ? credits : epargneClients;

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-card-foreground">Soldé</h1>
        </div>

        <Tabs
          defaultValue="credit"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full h-12 bg-muted/50 p-1">
            <TabsTrigger value="credit" className="flex-1 h-full text-base">
              Crédit Soldé
            </TabsTrigger>
            <TabsTrigger value="epargne" className="flex-1 h-full text-base">
              Épargne Soldé
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            className="pl-10 h-11 bg-muted/30"
            data-testid="input-search"
          />
        </div>
      </header>

      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">
            Chargement des clients...
          </div>
        ) : clients?.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Aucun client trouvé dans cette catégorie.
          </div>
        ) : (
          clients?.map((client) => (
            <button
              key={client.id}
              onClick={() => {
                const type = activeTab === "credit" ? "credit" : (client.code.startsWith("CP") ? "carte-pointage" : "compte-courant");
                setLocation(`/client/${type}/${client.id}`);
              }}
              data-testid={`card-client-${client.id}`}
              className="w-full flex items-center gap-4 p-4 bg-card border border-card-border rounded-md hover-elevate active-elevate-2"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-card-foreground">
                  {client.nom} {client.prenom}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{client.code}</span>
                  <span>•</span>
                  <span>{client.zone}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

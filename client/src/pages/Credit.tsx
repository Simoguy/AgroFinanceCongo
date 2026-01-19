import { useState } from "react";
import { ArrowLeft, Search, Plus, CreditCard, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Credit } from "@shared/schema";

export default function CreditPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("actif");

  const { data: credits, isLoading } = useQuery<Credit[]>({
    queryKey: ["/api/credits", { status: activeTab }],
    queryFn: async () => {
      const response = await fetch(`/api/credits?status=${activeTab}`);
      if (!response.ok) throw new Error("Failed to fetch credits");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation("/")}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-card-foreground">Crédit</h1>
          </div>
          <Button
            size="icon"
            className="rounded-full"
            onClick={() => setLocation("/add/credit")}
            data-testid="button-add-credit"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <Tabs
          defaultValue="actif"
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full h-12 bg-muted/50 p-1">
            <TabsTrigger value="actif" className="flex-1 h-full text-base">
              Actif
            </TabsTrigger>
            <TabsTrigger value="solde" className="flex-1 h-full text-base">
              Soldé
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
        ) : credits?.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Aucun client trouvé dans cette catégorie.
          </div>
        ) : (
          credits?.map((credit) => (
            <button
              key={credit.id}
              onClick={() => console.log(`Client ${credit.nom} clicked`)}
              data-testid={`card-client-${credit.id}`}
              className="w-full flex items-center gap-4 p-4 bg-card border border-card-border rounded-md hover-elevate active-elevate-2"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-card-foreground">
                  {credit.nom} {credit.prenom}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{credit.code}</span>
                  <span>•</span>
                  <span>{credit.zone}</span>
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

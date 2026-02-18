import { ArrowLeft, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Credit, CompteCourant, CartePointage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { useMemo, useState } from "react";

export default function Corbeille() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: credits = [], isLoading: loadingCredits } = useQuery<Credit[]>({
    queryKey: ["/api/credits?deleted=only"],
  });
  const { data: comptes = [], isLoading: loadingComptes } = useQuery<CompteCourant[]>({
    queryKey: ["/api/compte-courants?deleted=only"],
  });
  const { data: cartes = [], isLoading: loadingCartes } = useQuery<CartePointage[]>({
    queryKey: ["/api/carte-pointages?deleted=only"],
  });

  const isLoading = loadingCredits || loadingComptes || loadingCartes;

  const deletedClients = useMemo(() => {
    return [
      ...credits.map((client) => ({
        id: client.id,
        type: "credit",
        name: `${client.nom} ${client.prenom}`.trim(),
        phone: client.telephone,
        amount: `${((Number(client.nombreCompte) || 1) * 34100).toLocaleString()} FC`,
      })),
      ...comptes.map((client) => ({
        id: client.id,
        type: "compte-courant",
        name: `${client.nom} ${client.prenom}`.trim(),
        phone: client.telephone,
        amount: `${Math.max(0, Number(client.montant || 0) - 5000).toLocaleString()} FC`,
      })),
      ...cartes.map((client) => ({
        id: client.id,
        type: "carte-pointage",
        name: `${client.nom} ${client.prenom}`.trim(),
        phone: client.telephone,
        amount: `${Number(client.montant || 0).toLocaleString()} FC`,
      })),
    ].sort((a, b) => a.name.localeCompare(b.name));
  }, [credits, comptes, cartes]);

  const filteredClients = deletedClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={() => setLocation("/")} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-card-foreground">Corbeille</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Rechercher un client..." />

        <div className="space-y-1">
          {filteredClients.map((client) => (
            <button
              key={`${client.type}-${client.id}`}
              onClick={() => setLocation(`/client/${client.type}/${client.id}`)}
              className="w-full flex items-center gap-3 p-4 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-base font-medium text-card-foreground truncate">{client.name}</p>
                <p className="text-sm text-muted-foreground truncate">{client.phone}</p>
              </div>
              <span className="text-base font-bold text-muted-foreground">{client.amount}</span>
            </button>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun client dans la corbeille</p>
          </div>
        )}
      </div>
    </div>
  );
}

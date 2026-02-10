import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, User, Phone, MapPin, Tag, Calendar, PlusCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Credit, CompteCourant, CartePointage, Remboursement } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ClientDetails() {
  const [, params] = useRoute("/client/:type/:id");
  const [, setLocation] = useLocation();
  const { type, id } = params || {};
  const { toast } = useToast();

  const { data: client, isLoading } = useQuery<Credit | CompteCourant | CartePointage>({
    queryKey: [`/api/${type}s`, id],
  });

  const { data: remboursements = [] } = useQuery<Remboursement[]>({
    queryKey: ["/api/credits", id, "remboursements"],
    enabled: type === "credit",
  });

  const mutation = useMutation({
    mutationFn: async (data: { montant: number, type: string }) => {
      const res = await apiRequest("POST", `/api/credits/${id}/remboursements`, {
        creditId: id,
        montant: data.montant.toString(),
        type: data.type,
        agentId: (client as Credit).agentId
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/credits`, id] });
      queryClient.invalidateQueries({ queryKey: ["/api/credits", id, "remboursements"] });
      toast({ title: "Succès", description: "Opération enregistrée" });
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Chargement...</p></div>;
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Client introuvable</p>
        <Button onClick={() => setLocation("/")}>Retour à l'accueil</Button>
      </div>
    );
  }

  if (type === "credit") {
    const c = client as Credit;
    const baseAmount = 30000;
    const interestFactor = 213900 / (6 * 30000); // 1.188333...
    const creditTotal = Number(c.nombreCompte) * baseAmount * interestFactor;
    
    const totalVersements = Number(c.versements || 0);
    const totalPenalites = Number(c.penalites || 0);
    const resteAPayer = creditTotal - totalVersements;
    const totalVersementAvecPenalite = totalVersements + totalPenalites;

    const versementList = remboursements.filter(r => r.type === "versement");
    const penaliteList = remboursements.filter(r => r.type === "penalite");

    return (
      <div className="min-h-screen pb-20 bg-[#f0f0f0] dark:bg-background">
        <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4 flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={() => window.history.back()}><ArrowLeft className="w-5 h-5" /></Button>
          <h1 className="text-xl font-bold">Détails Crédit</h1>
        </header>

        <div className="p-4 space-y-4">
          {/* Top Card (Blue Gradient) */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs opacity-80">Code du compte</p>
                <p className="text-xl font-bold">{c.code}</p>
                <p className="text-xs opacity-80">{new Date(c.dateCreation).toISOString().split('T')[0]}</p>
                <p className="text-xs opacity-80">{c.telephone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Limite credit</p>
                <p className="text-2xl font-bold">{limiteCreditIndividuel.toLocaleString()} <span className="text-sm">XAF</span></p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <Card className="rounded-3xl border-none shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <p className="font-medium">Nombre de compte</p>
                <p className="font-bold text-lg">{c.nombreCompte}</p>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Credit total</p>
                  <p className="text-xs text-muted-foreground">X nombre de compte</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{creditTotal.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">XAF</p>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Versements</p>
                  <p className="text-xs text-muted-foreground">x nombre de compte</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">-{totalVersements.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">XAF</p>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Pénalités</p>
                  <p className="text-xs text-muted-foreground">x nombre de compte</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-red-600">{totalPenalites.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">XAF</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Commentaire</p>
                <p className="text-sm text-muted-foreground min-h-[40px]">{c.commentaire || "Aucun commentaire"}</p>
              </div>

              <Button variant="ghost" className="w-full text-green-600 font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Commenter
              </Button>

              <div className="flex gap-4 border-t pt-4">
                <button 
                  className="flex-1 text-green-600 text-sm font-bold"
                  onClick={() => {
                    const list = versementList.map(v => `${new Date(v.date).toLocaleDateString()}: ${Number(v.montant).toLocaleString()} XAF`).join("\n");
                    alert(list || "Aucun versement");
                  }}
                >
                  liste de versements
                </button>
                <button 
                  className="flex-1 text-red-600 text-sm font-bold"
                  onClick={() => {
                    const list = penaliteList.map(p => `${new Date(p.date).toLocaleDateString()}: ${Number(p.montant).toLocaleString()} XAF`).join("\n");
                    alert(list || "Aucune pénalité");
                  }}
                >
                  liste de pénalités
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Totals */}
          <div className="space-y-4 px-2">
            <div className="flex justify-between items-center">
              <p className="font-bold">Reste a payer sur le crédit</p>
              <div className="text-right">
                <p className="font-bold">= {resteAPayer.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">XAF</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-red-600">
              <p className="font-bold">Total versement avec pénalité</p>
              <div className="text-right">
                <p className="font-bold">= {totalVersementAvecPenalite.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground text-red-600/60">XAF</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md" onClick={() => {
              const amount = prompt("Montant du versement ?");
              if (amount) mutation.mutate({ montant: Number(amount), type: "versement" });
            }}>
              Effectuer Versement
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-bold text-lg" onClick={() => {
              const amount = prompt("Montant de la pénalité ?");
              if (amount) mutation.mutate({ montant: Number(amount), type: "penalite" });
            }}>
              Appliquer Pénalité
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4 flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={() => window.history.back()}><ArrowLeft className="w-5 h-5" /></Button>
        <h1 className="text-2xl font-bold">Détails du Client</h1>
      </header>
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-8 h-8 text-primary" /></div>
            <div className="flex-1">
              <CardTitle className="text-xl">{client.nom} {client.prenom}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{client.code}</Badge>
                <Badge className="bg-primary/20 text-primary border-none text-xs">{client.status.toUpperCase()}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-muted-foreground" /><span className="text-sm">{client.telephone}</span></div>
              <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-muted-foreground" /><span className="text-sm">{client.adresse} ({client.zone})</span></div>
              <div className="flex items-center gap-3"><Tag className="w-4 h-4 text-muted-foreground" /><span className="text-sm">{client.activite}</span></div>
              <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Créé le {new Date(client.dateCreation).toLocaleDateString("fr-FR")}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

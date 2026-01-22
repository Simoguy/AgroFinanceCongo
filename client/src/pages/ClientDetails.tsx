import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, User, Phone, MapPin, Tag, Calendar, PlusCircle, MessageSquare, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Credit, CompteCourant, CartePointage, Remboursement, TransactionCarte, TransactionCompte } from "@shared/schema";
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

  const { data: transactionsCarte = [] } = useQuery<TransactionCarte[]>({
    queryKey: ["/api/carte-pointages", id, "transactions"],
    enabled: type === "carte-pointage",
  });

  const { data: transactionsCompte = [] } = useQuery<TransactionCompte[]>({
    queryKey: ["/api/compte-courants", id, "transactions"],
    enabled: type === "compte-courant",
  });

  const mutation = useMutation({
    mutationFn: async (data: { montant: number, type?: string }) => {
      let endpoint = "";
      let payload = {};

      if (type === "credit") {
        endpoint = `/api/credits/${id}/remboursements`;
        payload = { creditId: id, montant: data.montant.toString(), type: data.type, agentId: (client as Credit).agentId };
      } else if (type === "carte-pointage") {
        endpoint = `/api/carte-pointages/${id}/transactions`;
        payload = { carteId: id, montant: data.montant.toString(), agentId: (client as CartePointage).agentId };
      } else if (type === "compte-courant") {
        endpoint = `/api/compte-courants/${id}/transactions`;
        payload = { compteId: id, montant: data.montant.toString(), type: data.type || "versement", agentId: (client as CompteCourant).agentId };
      }
      
      const res = await apiRequest("POST", endpoint, payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`, id] });
      queryClient.invalidateQueries({ queryKey: [type === "credit" ? "/api/credits" : type === "carte-pointage" ? "/api/carte-pointages" : "/api/compte-courants", id, type === "credit" ? "remboursements" : "transactions"] });
      toast({ title: "Succès", description: "Opération enregistrée" });
    }
  });

  const solderMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/${type}s/${id}/status`, { status: "solde" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`, id] });
      toast({ title: "Succès", description: "Compte soldé" });
      setLocation("/");
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

  if (type === "compte-courant") {
    const cc = client as CompteCourant;
    return (
      <div className="min-h-screen pb-20 bg-[#f0f0f0] dark:bg-background">
        <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => window.history.back()}><ArrowLeft className="w-5 h-5" /></Button>
            <h1 className="text-xl font-bold">{cc.nom.split(' ')[0]}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-blue-500"><Phone className="w-5 h-5" /></Button>
            <Button size="icon" variant="ghost" className="text-blue-500"><MessageSquare className="w-5 h-5" /></Button>
            <Button size="icon" variant="ghost" className="text-blue-500"><Briefcase className="w-5 h-5" /></Button>
          </div>
        </header>

        <div className="p-4 space-y-6">
          {/* Top Profile Area */}
          <div className="flex flex-col items-center py-6 bg-gray-500/10 rounded-3xl space-y-2 relative">
             <div className="w-8 h-8 rounded-full bg-gray-400/20 absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
               <span className="text-xs">!</span>
             </div>
             <h2 className="text-xl font-bold mt-6">{cc.nom} {cc.prenom}</h2>
             <p className="text-gray-500">{cc.activite}</p>
          </div>

          {/* Blue Card */}
          <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden h-32 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs opacity-70">Code du compte</p>
                <p className="text-sm font-medium">{cc.code}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-70">Frais du compte</p>
                <p className="text-2xl font-bold">{Number(cc.montant).toLocaleString()}</p>
                <p className="text-[10px] opacity-70">XAF</p>
              </div>
            </div>
          </div>

          {/* Solde Display */}
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">Solde</p>
                <p className="text-2xl font-bold text-green-600">{Number(cc.solde).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center space-y-4 pt-2">
            <button 
              className="text-gray-400 font-medium hover:text-blue-500 transition-colors"
              onClick={() => {
                const list = transactionsCompte.filter(t => t.type === 'versement').map(t => `${new Date(t.date).toLocaleDateString()}: ${Number(t.montant).toLocaleString()} XAF`).join("\n");
                alert(list || "Aucun versement");
              }}
            >
              Ouvrir liste de versements
            </button>
            <button 
              className="text-gray-400 font-medium hover:text-blue-500 transition-colors"
              onClick={() => {
                const list = transactionsCompte.filter(t => t.type === 'retrait').map(t => `${new Date(t.date).toLocaleDateString()}: ${Number(t.montant).toLocaleString()} XAF`).join("\n");
                alert(list || "Aucun retrait");
              }}
            >
              Ouvrir liste de retraits
            </button>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md uppercase"
              onClick={() => {
                const amount = prompt("Montant du versement ?");
                if (amount) mutation.mutate({ montant: Number(amount), type: "versement" });
              }}
            >
              Effectuer un versement
            </Button>
            <Button 
              variant="outline"
              className="w-full h-14 rounded-2xl border-blue-600 text-blue-600 font-bold text-lg shadow-md uppercase"
              onClick={() => {
                const amount = prompt("Montant du retrait ?");
                if (amount) mutation.mutate({ montant: Number(amount), type: "retrait" });
              }}
            >
              Effectuer un retrait
            </Button>
            <Button 
              className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-md"
              onClick={() => {
                if (confirm("Voulez-vous vraiment solder ce compte ?")) solderMutation.mutate();
              }}
            >
              Solder le compte
            </Button>
          </div>
        </div>
      </div>
    );
  }
    const cp = client as CartePointage;
    return (
      <div className="min-h-screen pb-20 bg-[#f0f0f0] dark:bg-background">
        <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => window.history.back()}><ArrowLeft className="w-5 h-5" /></Button>
            <h1 className="text-xl font-bold">{cp.nom.split(' ')[0]}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-blue-500"><Phone className="w-5 h-5" /></Button>
            <Button size="icon" variant="ghost" className="text-blue-500"><MessageSquare className="w-5 h-5" /></Button>
            <Button size="icon" variant="ghost" className="text-blue-500"><Briefcase className="w-5 h-5" /></Button>
          </div>
        </header>

        <div className="p-4 space-y-6">
          {/* Top Profile Area */}
          <div className="flex flex-col items-center py-6 bg-gray-500/10 rounded-3xl space-y-2 relative">
             <div className="w-8 h-8 rounded-full bg-gray-400/20 absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
               <span className="text-xs">!</span>
             </div>
             <h2 className="text-xl font-bold mt-6">{cp.nom} {cp.prenom}</h2>
             <p className="text-gray-500">{cp.activite}</p>
          </div>

          {/* Blue Card */}
          <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden h-32 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs opacity-70">Code du compte</p>
                <p className="text-sm font-medium">{cp.code}</p>
                <p className="text-xs opacity-70">{new Date(cp.dateCreation).toISOString().split('T')[0]}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-70">Limite credit</p>
                <p className="text-2xl font-bold">{Number(cp.montant).toLocaleString()}</p>
                <p className="text-[10px] opacity-70">XAF</p>
              </div>
            </div>
          </div>

          {/* Versements Display */}
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">Versements</p>
                <p className="text-2xl font-bold text-green-600">{Number(cp.versements).toLocaleString()}</p>
              </div>
              <div className="flex justify-end">
                <p className="text-[10px] text-gray-400">XAF</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center space-y-4 pt-2">
            <p className="text-gray-600 font-medium">Nombre de versement effectuer: {cp.nombreVersements}</p>
            <button 
              className="text-gray-400 font-medium hover:text-blue-500 transition-colors"
              onClick={() => {
                const list = transactionsCarte.map(t => `${new Date(t.date).toLocaleDateString()}: ${Number(t.montant).toLocaleString()} XAF`).join("\n");
                alert(list || "Aucun versement");
              }}
            >
              Ouvrir liste de versements
            </button>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md"
              onClick={() => {
                const amount = prompt("Montant du versement ?");
                if (amount) mutation.mutate({ montant: Number(amount) });
              }}
            >
              Effectuer Versement
            </Button>
            <Button 
              className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-md"
              onClick={() => {
                if (confirm("Voulez-vous vraiment solder ce compte ?")) solderMutation.mutate();
              }}
            >
              Solder le compte
            </Button>
          </div>
        </div>
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
                <p className="text-2xl font-bold">{baseAmount.toLocaleString()} <span className="text-sm">XAF</span></p>
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

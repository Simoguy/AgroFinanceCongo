import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, User, Phone, MapPin, Tag, Calendar, PlusCircle, MessageSquare, Scale, X, Camera, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Credit, CompteCourant, CartePointage, Remboursement } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { format } from "date-fns";

export default function ClientDetails() {
  const [, params] = useRoute("/client/:type/:id");
  const [, setLocation] = useLocation();
  const { type, id } = params || {};
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'versements' | 'penalites' | 'retraits' | null>(null);

  const { data: client, isLoading } = useQuery<any>({
    queryKey: [`/api/${type}s`, id],
  });

  const { data: remboursements = [] } = useQuery<Remboursement[]>({
    queryKey: ["/api/credits", id, "remboursements"],
    enabled: type === "credit",
  });

  const { data: epargneTransactions = [] } = useQuery<Remboursement[]>({
    queryKey: [`/api/${type}s`, id, "transactions"],
    enabled: type === "carte-pointage" || type === "compte-courant",
  });

  const mutation = useMutation({
    mutationFn: async (data: { montant: number, type: string }) => {
      const endpoint = type === "credit" ? `/api/credits/${id}/remboursements` : `/api/${type}s/${id}/transactions`;
      const res = await apiRequest("POST", endpoint, {
        montant: data.montant.toString(),
        type: data.type,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`, id] });
      queryClient.invalidateQueries({ queryKey: ["/api/credits", id, "remboursements"] });
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`, id, "transactions"] });
      toast({ title: "Succès", description: "Opération enregistrée" });
    }
  });

  const solderMutation = useMutation({
    mutationFn: async () => {
      const endpoint = type === "credit" ? `/api/credits/${id}/status` : `/api/${type}s/${id}/status`;
      await apiRequest("PATCH", endpoint, { status: 'solde' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`] });
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`, id] });
      toast({ title: "Succès", description: "Compte soldé" });
      setLocation("/solde");
    }
  });

  const contencieuxMutation = useMutation({
    mutationFn: async () => {
      const endpoint = type === "credit" ? `/api/credits/${id}/status` : `/api/${type}s/${id}/status`;
      await apiRequest("PATCH", endpoint, { status: 'contentieux' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`] });
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`, id] });
      toast({ title: "Succès", description: "Client en contentieux" });
      setLocation("/contencieux");
    }
  });

  const reactivateMutation = useMutation({
    mutationFn: async () => {
      const endpoint = type === "credit" ? `/api/credits/${id}/status` : `/api/${type}s/${id}/status`;
      await apiRequest("PATCH", endpoint, { status: 'actif' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`] });
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`, id] });
      toast({ title: "Succès", description: "Client réactivé" });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Client introuvable</p>
        <Button onClick={() => setLocation("/")}>Retour à l'accueil</Button>
      </div>
    );
  }

  const isCredit = type === "credit";
  const isCompteCourant = type === "compte-courant";
  const isPointage = type === "carte-pointage";

  if (isCredit) {
    const c = client as Credit;
    const baseAmount = 30000;
    const interestFactor = 213900 / (6 * 30000);
    const creditTotal = Number(c.nombreCompte) * baseAmount * interestFactor;
    const totalVersements = Number(c.versements || 0);
    const totalPenalites = Number(c.penalites || 0);
    const resteAPayer = creditTotal - totalVersements;

    const versementsList = remboursements.filter(r => r.type === "versement");
    const penalitesList = remboursements.filter(r => r.type === "penalite");

    return (
      <div className="min-h-screen pb-28 bg-[#f2f2f7]">
        <div className="bg-transparent px-4 h-14 flex items-center justify-between sticky top-0 z-50">
          <button onClick={() => window.history.back()} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-600 rounded-3xl p-6 text-white shadow-lg space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs opacity-80 uppercase font-bold tracking-wider">Code du compte</p>
                <h2 className="text-xl font-bold uppercase">{c.code}</h2>
                <p className="text-xs opacity-80">{format(new Date(c.dateCreation), 'yyyy-MM-dd')}</p>
                <p className="text-xs opacity-80">{c.telephone}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase opacity-80 font-bold">Limite credit</p>
                <p className="text-2xl font-black">{baseAmount.toLocaleString()}</p>
                <p className="text-[10px] opacity-80 font-bold">XAF</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-slate-800">Nombre de compte</span>
              <span className="text-xl font-bold">{c.nombreCompte}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-base font-medium text-slate-800 block">Credit total</span>
                  <span className="text-xs text-slate-400 italic">X nombre de compte</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold block">{creditTotal.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-bold">XAF</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-base font-medium text-slate-800 block">Versements</span>
                  <span className="text-xs text-slate-400 italic">x nombre de compte</span>
                </div>
                <div className="text-right text-green-500">
                  <span className="text-xl font-bold block">-{totalVersements.toLocaleString()}</span>
                  <span className="text-[10px] opacity-80 font-bold">XAF</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-base font-medium text-slate-800 block">Pénalités</span>
                  <span className="text-xs text-slate-400 italic">x nombre de compte</span>
                </div>
                <div className="text-right text-red-500">
                  <span className="text-xl font-bold block">{totalPenalites.toLocaleString()}</span>
                  <span className="text-[10px] opacity-80 font-bold">XAF</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full flex items-center justify-center gap-2 py-4 text-green-600 font-bold text-lg">
                <MessageSquare className="w-5 h-5" />
                Commenter
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 flex gap-4 shadow-sm">
            <button 
              onClick={() => setActiveTab(activeTab === 'versements' ? null : 'versements')}
              className={`flex-1 py-4 font-bold border-r border-slate-100 ${activeTab === 'versements' ? 'text-primary' : 'text-green-600'}`}
            >
              liste de versements
            </button>
            <button 
              onClick={() => setActiveTab(activeTab === 'penalites' ? null : 'penalites')}
              className={`flex-1 py-4 font-bold ${activeTab === 'penalites' ? 'text-primary' : 'text-red-400'}`}
            >
              liste de pénalités
            </button>
          </div>

          <AnimatePresence>
            {activeTab && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-3xl p-4 shadow-sm space-y-2 max-h-60 overflow-y-auto">
                  <h4 className="text-sm font-bold text-slate-500 px-2 uppercase">
                    {activeTab === 'versements' ? 'Historique des versements' : 'Historique des pénalités'}
                  </h4>
                  {(activeTab === 'versements' ? versementsList : penalitesList).map(t => (
                    <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                      <span className="text-xs text-slate-500">{format(new Date(t.date), 'dd/MM/yyyy')}</span>
                      <span className={`font-bold ${activeTab === 'versements' ? 'text-green-600' : 'text-red-500'}`}>
                        {Number(t.montant).toLocaleString()} XAF
                      </span>
                    </div>
                  ))}
                  {(activeTab === 'versements' ? versementsList : penalitesList).length === 0 && (
                    <p className="text-center py-4 text-slate-400 italic">Aucune transaction trouvée</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-slate-800">Reste a payer sur le crédit</span>
              <div className="text-right">
                <span className="text-xl font-bold block">= {resteAPayer.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-bold">XAF</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-red-600">
              <span className="text-base font-bold">Total versement avec pénalité</span>
              <div className="text-right">
                <span className="text-xl font-bold block">= {(totalVersements + totalPenalites).toLocaleString()}</span>
                <span className="text-[10px] opacity-80 font-bold">XAF</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {client.status === 'solde' ? (
              <>
                <Button className="w-full h-16 rounded-[1.5rem] bg-[#1976d2] text-white text-lg font-bold uppercase tracking-tight shadow-lg" onClick={() => {
                  const path = type === 'credit' ? '/add-credit' : (type === 'compte-courant' ? '/add-compte-courant' : '/add-carte-pointage');
                  setLocation(path);
                }}>
                  Recréer le compte
                </Button>
                <Button variant="outline" className="w-full h-16 rounded-[1.5rem] border-2 border-primary text-primary text-lg font-bold uppercase tracking-tight" onClick={() => reactivateMutation.mutate()}>
                  Renvoyer aux actifs
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full h-16 rounded-[1.5rem] bg-[#1976d2] text-white text-lg font-bold uppercase tracking-tight shadow-lg" onClick={() => {
                  const amount = prompt("Montant du versement ?");
                  if (amount) mutation.mutate({ montant: Number(amount), type: "versement" });
                }}>
                  Effectuer Versement
                </Button>
                <Button variant="outline" className="w-full h-16 rounded-[1.5rem] border-2 border-red-200 text-red-500 text-lg font-bold uppercase tracking-tight" onClick={() => {
                  const amount = prompt("Montant de la pénalité ?");
                  if (amount) mutation.mutate({ montant: Number(amount), type: "penalite" });
                }}>
                  Appliquer Pénalité
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => contencieuxMutation.mutate()} variant="secondary" className="h-14 rounded-2xl font-bold text-red-600">CONTENTIEUX</Button>
                  <Button onClick={() => solderMutation.mutate()} variant="secondary" className="h-14 rounded-2xl font-bold text-green-600">SOLDER</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Épargne Details (Pointage / Compte Courant)
  const e = client as any;
  const initialMise = Number(e.montant || 0);
  const accountFee = isCompteCourant ? 5000 : 0;
  const solde = Math.max(0, initialMise - accountFee);

  return (
    <div className="min-h-screen bg-[#f2f2f7] pb-28">
      <div className="bg-transparent px-4 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button onClick={() => window.history.back()} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Phone className="w-5 h-5 text-[#007AFF] fill-[#007AFF]" />
          <FileText className="w-5 h-5 text-[#007AFF]" />
          <Camera className="w-5 h-5 text-[#007AFF]" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="bg-[#5c5c5c] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-[#3a3a3a] rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight uppercase">{e.nom} {e.prenom}</h2>
              <p className="text-slate-300 font-medium">{e.activite || "technicien"}</p>
            </div>
          </div>
          <div className="mt-8 bg-gradient-to-r from-[#00aeef] via-[#0071bc] to-[#662d91] rounded-[1.5rem] p-6 flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">Code du compte</p>
              <p className="text-sm font-mono font-bold tracking-wider">{e.code}</p>
              <p className="text-xs font-medium opacity-80">{format(new Date(e.dateCreation), 'yyyy-MM-dd')}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] opacity-70 uppercase font-bold">Mise initiale</p>
              <p className="text-2xl font-black leading-none">{initialMise.toLocaleString()}</p>
              <p className="text-[10px] opacity-70 font-bold mt-1">XAF</p>
            </div>
          </div>
        </div>

        <div className="bg-[#eeeeee] rounded-[2rem] p-8 shadow-sm relative min-h-[140px] flex flex-col justify-center mb-8">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-800">{isPointage ? 'Versements' : 'Solde'}</span>
            </div>
            <span className="text-2xl font-black text-[#4caf50]">
              {solde.toLocaleString()}
            </span>
          </div>
          <p className="absolute bottom-6 right-8 text-[10px] font-bold text-slate-400">XAF</p>
        </div>

        {(isPointage || isCompteCourant) && (
          <div className="flex flex-col items-center gap-6 mt-4 mb-8">
            <p className="text-base font-bold text-slate-800">
              Nombre de versement effectuer: {epargneTransactions.filter(t => t.type === 'versement').length}
            </p>
            <button 
              className="text-lg font-medium text-slate-400 hover:text-primary transition-colors"
              onClick={() => setActiveTab(activeTab === 'versements' ? null : 'versements')}
            >
              Ouvir liste de versements
            </button>
          </div>
        )}

        <AnimatePresence>
          {(isPointage || isCompteCourant) && activeTab === 'versements' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl p-4 shadow-sm space-y-2 max-h-60 overflow-y-auto">
                <div className="flex justify-between items-center px-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-500 uppercase">
                    Historique des versements
                  </h4>
                  <button onClick={() => setActiveTab(null)} className="p-1">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                {epargneTransactions.filter(t => t.type === 'versement').map(t => (
                  <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                    <span className="text-xs text-slate-500">{format(new Date(t.date), 'dd/MM/yyyy')}</span>
                    <span className="font-bold text-green-600">
                      {Number(t.montant).toLocaleString()} XAF
                    </span>
                  </div>
                ))}
                {epargneTransactions.filter(t => t.type === 'versement').length === 0 && (
                  <p className="text-center py-4 text-slate-400 italic">Aucun versement trouvé</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-4 flex flex-col gap-3">
          {client.status === 'solde' ? (
            <>
              <Button className="w-full h-16 rounded-[1.5rem] bg-[#1976d2] text-white text-lg font-bold uppercase tracking-tight shadow-lg" onClick={() => {
                const path = type === 'compte-courant' ? '/add-compte-courant' : '/add-carte-pointage';
                setLocation(path);
              }}>
                Recréer le compte
              </Button>
              <Button variant="outline" className="w-full h-16 rounded-[1.5rem] border-2 border-primary text-primary text-lg font-bold uppercase tracking-tight" onClick={() => reactivateMutation.mutate()}>
                Renvoyer aux actifs
              </Button>
            </>
          ) : (
            <>
              <Button className="w-full h-16 rounded-[1.5rem] bg-[#1976d2] text-white text-lg font-bold uppercase tracking-tight shadow-md" onClick={() => {
                const amount = prompt("Montant du versement ?");
                if (amount) mutation.mutate({ montant: Number(amount), type: "versement" });
              }}>
                EFFECTUER UN VERSEMENT
              </Button>
              {!isPointage && (
                <Button variant="outline" className="w-full h-16 rounded-[1.5rem] border-red-200 text-red-500 text-lg font-bold uppercase tracking-tight shadow-sm" onClick={() => {
                  const amount = prompt("Montant du retrait ?");
                  if (amount) mutation.mutate({ montant: Number(amount), type: "retrait" });
                }}>
                  EFFECTUER UN RETRAIT
                </Button>
              )}
              <Button onClick={() => solderMutation.mutate()} variant="secondary" className="w-full h-16 rounded-[1.5rem] font-bold text-red-600 uppercase shadow-sm">Solder le compte</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

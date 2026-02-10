import {
  addSecurityLog,
  getSecurityLogs,
  clearSecurityLogs,
} from "@/lib/securityLogs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, Trash2, RotateCcw, Calendar, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type Log = {
  date: string;
  user: string;
  type: "ACCES" | "ACTION" | "ADMIN";
  action: string;
};

export default function SecurityProfile() {
  const { user } = useAuth();
  const { toast } = useToast();

  const currentUser = user?.username || "Utilisateur inconnu";
  const isAdmin = user?.role === "admin";

  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);

  const [showReset, setShowReset] = useState(false);

  // ✅ Chargement initial + log d'accès
  useEffect(() => {
    setLogs(getSecurityLogs());
    addLog("ACCES", "Accès à Sécurité & Confidentialité");
  }, []);

  // ✅ Ajouter un log
  const addLog = async (type: Log["type"], action: string) => {
    const newLog: Log = {
      date: new Date().toLocaleString(),
      user: currentUser,
      type,
      action,
    };

    const updatedLogs = await addSecurityLog(newLog);
    setLogs(updatedLogs);
  };

  // ✅ Ouvrir / fermer les logs
  const handleOpenLogs = () => {
    setShowLogs(!showLogs);
    addLog("ACTION", "Ouverture de la traçabilité");
  };

  // ✅ Vider logs (ADMIN)
  const handleClearLogs = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer tous les logs ?")) return;

    clearSecurityLogs();

    const adminLog: Log = {
      date: new Date().toLocaleString(),
      user: currentUser,
      type: "ADMIN",
      action: "Suppression de tous les logs",
    };

    const updatedLogs = await addSecurityLog(adminLog);
    setLogs(updatedLogs);
    toast({
      title: "Logs supprimés",
      description: "L'historique de traçabilité a été vidé."
    });
  };

  // ✅ Réinitialiser le compte (Indépendant des logs)
  const handleResetAccount = () => {
    if (!window.confirm("Êtes-vous sûr de vouloir réinitialiser votre compte ? Cette action est indépendante de la traçabilité et ne sera pas consignée dans les logs.")) return;
    
    toast({
      title: "Compte réinitialisé",
      description: "Votre compte a été réinitialisé avec succès (Action non consignée)."
    });
    setShowReset(false);
  };

  // ✅ Badge couleur
  const badgeVariant = (type: Log["type"]) => {
    switch (type) {
      case "ACCES":
        return "secondary";
      case "ACTION":
        return "default";
      case "ADMIN":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <header className="flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Sécurité & Confidentialité</h1>
      </header>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleOpenLogs} variant="outline" className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Traçabilité / Logs
        </Button>

        <Button
          variant="destructive"
          onClick={() => setShowReset(!showReset)}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser le compte
        </Button>
      </div>

      {/* ============================ */}
      {/* CARTE RÉINITIALISER */}
      {/* ============================ */}
      <AnimatePresence>
        {showReset && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-destructive/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Réinitialisation du compte
                </CardTitle>
                <Badge variant="destructive">CONFIDENTIEL</Badge>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">
                      Action Sensible : Cette réinitialisation est conçue pour être indépendante du système de traçabilité. Aucun log ne sera généré pour cette opération.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Voulez-vous procéder à la remise à zéro de vos paramètres personnels ?
                  </p>
                  <div className="flex gap-3">
                    <Button variant="destructive" size="sm" onClick={handleResetAccount}>
                      Confirmer (Sans Log)
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowReset(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================ */}
      {/* CARTE LOGS */}
      {/* ============================ */}
      <AnimatePresence>
        {showLogs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl">Journal d’activité</CardTitle>

                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleClearLogs}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Vider l'historique
                  </Button>
                )}
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {logs.length > 0 ? (
                      logs.map((log, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between gap-4 border-b pb-3 last:border-0"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">{log.action}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{log.date}</span>
                              <span className="text-border">|</span>
                              <User className="w-3 h-3" />
                              <span>{log.user}</span>
                            </div>
                          </div>

                          <Badge variant={badgeVariant(log.type)} className="text-[10px] uppercase font-bold px-2">
                            {log.type}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-muted-foreground italic">
                        Aucun journal d'activité disponible.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { audit } from "@/lib/audit";
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
import { ShieldCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

type Log = {
  date: string;
  user: string;
  type: "ACCES" | "ACTION" | "ADMIN";
  action: string;
};

export default function SecurityProfile() {
  const { user } = useAuth();

  const currentUser = user?.name || "Utilisateur inconnu";
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

      {/* ============================ */}
      {/* BOUTONS */}
      {/* ============================ */}
      <Button onClick={handleOpenLogs}>
        Traçabilité / Logs
      </Button>

      <Button
        variant="destructive"
        onClick={() => setShowReset(!showReset)}
      >
        Réinitialiser le compte utilisateur
      </Button>

      {/* ============================ */}
      {/* CARTE RÉINITIALISER */}
      {/* ============================ */}
      {showReset && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-destructive">
              Réinitialiser le compte utilisateur
            </CardTitle>
            <Badge variant="destructive">ADMIN</Badge>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-40 pr-2">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Cette fonctionnalité permettra de réinitialiser le compte de l’utilisateur.
                </p>
                <Button variant="destructive" size="sm">
                  Confirmer la réinitialisation
                </Button>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* ============================ */}
      {/* CARTE LOGS */}
      {/* ============================ */}
      {showLogs && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Journal d’activité</CardTitle>

            {isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearLogs}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vider
              </Button>
            )}
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-64 pr-2">
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-4 border-b pb-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.date} — {log.user}
                      </p>
                    </div>

                    <Badge variant={badgeVariant(log.type)}>
                      {log.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

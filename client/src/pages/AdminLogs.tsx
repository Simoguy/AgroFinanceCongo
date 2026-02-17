import { ArrowLeft, ShieldCheck, History } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function AdminLogs() {
  const [, setLocation] = useLocation();

  // For now, we'll mock the logs since we don't have a specific logs table yet
  // but we can show the recent transactions as a form of log
  const { data: transactions = [] } = useQuery<any[]>({ 
    queryKey: ["/api/transactions/recent"] 
  });

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/profile")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-card-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Traçabilité Logs
          </h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">Activités Récentes</span>
          </div>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground italic">
                  Aucune activité récente enregistrée
                </CardContent>
              </Card>
            ) : (
              transactions.map((log: any) => (
                <Card key={log.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground capitalize">
                        {log.type} - {log.montant.toLocaleString()} XAF
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Agent: {log.agentId} | Client ID: {log.creditId || log.compteCourantId || log.cartePointageId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-500">
                        {format(new Date(log.date), 'dd/MM/yyyy')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {format(new Date(log.date), 'HH:mm')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

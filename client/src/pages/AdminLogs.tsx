import { ArrowLeft, ShieldCheck, History } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function AdminLogs() {
  const [, setLocation] = useLocation();

  const { data: logs = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/logs"],
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
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
            <span className="text-sm font-medium">Activités Systèmes</span>
          </div>

          <div className="space-y-3">
            {logs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground italic">
                  Aucun log enregistré
                </CardContent>
              </Card>
            ) : (
              logs.map((log: any) => (
                <Card key={log.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <p className="font-bold text-foreground">
                          {log.action}
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                          {log.details}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs font-bold text-primary whitespace-nowrap">
                          {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss (XXX)')}
                        </p>
                        <Badge variant="outline" className="text-[10px] mt-1">
                          {log.role}
                        </Badge>
                      </div>
                    </div>
                    
                    {log.oldValue && log.newValue && (
                      <div className="bg-muted/50 p-2 rounded-md border border-dashed text-[11px] font-mono">
                        <span className="text-muted-foreground line-through">{log.oldValue}</span>
                        <span className="mx-2 text-primary">→</span>
                        <span className="text-foreground font-bold">{log.newValue}</span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t grid grid-cols-2 gap-2 text-[11px]">
                      <div className="space-y-1">
                        <p><span className="font-bold">Utilisateur:</span> {log.agentName} ({log.agentId})</p>
                        <p><span className="font-bold">Agence:</span> {log.agence}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p><span className="font-bold">IP:</span> {log.ipAddress}</p>
                        <p className="truncate"><span className="font-bold">Appareil:</span> {log.userAgent}</p>
                      </div>
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

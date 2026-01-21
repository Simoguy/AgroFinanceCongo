import { useParams, useLocation } from "wouter";
import { ArrowLeft, CreditCard, Wallet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Credit, CompteCourant, CartePointage } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AgentPortfolioDetail() {
  const { agentId } = useParams<{ agentId: string }>();
  const [, setLocation] = useLocation();

  const { data: credits = [] } = useQuery<Credit[]>({ queryKey: ["/api/credits"] });
  const { data: comptes = [] } = useQuery<CompteCourant[]>({ queryKey: ["/api/compte-courants"] });
  const { data: cartes = [] } = useQuery<CartePointage[]>({ queryKey: ["/api/carte-pointages"] });

  const agentCredits = credits.filter(c => c.agentId === agentId);
  const agentComptes = comptes.filter(c => c.agentId === agentId);
  const agentCartes = cartes.filter(c => c.agentId === agentId);

  const savedAgents = localStorage.getItem("agro_finance_agents");
  const agents = savedAgents ? JSON.parse(savedAgents) : [];
  const agent = agents.find((a: any) => a.agentId === agentId) || { name: agentId };

  const ClientItem = ({ client, type }: { client: any, type: string }) => (
    <Card 
      className="mb-3 hover-elevate cursor-pointer" 
      onClick={() => setLocation(`/client/${type}/${client.id}`)}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="font-bold">{client.nom} {client.prenom}</p>
          <p className="text-xs text-muted-foreground">{client.code}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{client.zone}</p>
          <p className="text-xs text-muted-foreground">{new Date(client.dateCreation).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/agent-portfolios")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-card-foreground">
              Portefeuille: {agent.name}
            </h1>
            <p className="text-xs text-muted-foreground">ID: {agentId}</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Tabs defaultValue="credits">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="credits">Crédits</TabsTrigger>
            <TabsTrigger value="epargne">Épargne</TabsTrigger>
            <TabsTrigger value="cartes">Cartes</TabsTrigger>
          </TabsList>

          <TabsContent value="credits" className="space-y-4">
            {agentCredits.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucun crédit enregistré</p>
            ) : (
              agentCredits.map(c => <ClientItem key={c.id} client={c} type="credit" />)
            )}
          </TabsContent>

          <TabsContent value="epargne" className="space-y-4">
            {agentComptes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucun compte courant enregistré</p>
            ) : (
              agentComptes.map(c => <ClientItem key={c.id} client={c} type="compte-courant" />)
            )}
          </TabsContent>

          <TabsContent value="cartes" className="space-y-4">
            {agentCartes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucune carte de pointage enregistrée</p>
            ) : (
              agentCartes.map(c => <ClientItem key={c.id} client={c} type="carte-pointage" />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

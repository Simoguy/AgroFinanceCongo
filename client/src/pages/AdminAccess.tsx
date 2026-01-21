import { useState } from "react";
import { ArrowLeft, UserPlus, Shield, User } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminAccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Mock current agents - in real app would use react-query
  const [agents, setAgents] = useState([
    { id: 1, name: "Lesly Muamba", agentId: "AG-2024-001", role: "agent" },
  ]);

  const [newName, setNewName] = useState("");
  const MAX_AGENTS = 5;

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (agents.length >= MAX_AGENTS) {
      toast({
        title: "Limite atteinte",
        description: `Vous ne pouvez pas créer plus de ${MAX_AGENTS} agents.`,
        variant: "destructive",
      });
      return;
    }

    const newAgent = {
      id: agents.length + 1,
      name: newName,
      agentId: `AG-2024-00${agents.length + 1}`,
      role: "agent"
    };

    setAgents([...agents, newAgent]);
    setNewName("");
    toast({
      title: "Agent créé",
      description: `L'agent ${newName} a été ajouté avec succès.`,
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/profile")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-card-foreground">Gestion accès</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Nouvel Agent ({agents.length}/{MAX_AGENTS})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Nom complet de l'agent</Label>
                <Input
                  id="agent-name"
                  placeholder="Ex: Jean Dupont"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={agents.length >= MAX_AGENTS}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={!newName || agents.length >= MAX_AGENTS}
              >
                Créer l'agent
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Liste des agents
          </h3>
          <div className="grid gap-3">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.agentId}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{agent.role}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

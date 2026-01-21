import { useState } from "react";
import { ArrowLeft, UserPlus, Shield, User, LogIn } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminAccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState("");
  
  const [agents, setAgents] = useState([
    { id: 1, name: "Lesly Muamba", agentId: "AG-2024-001", role: "agent" },
  ]);

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"agent" | "admin_secondaire">("agent");
  const MAX_USERS = 5;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminName.toLowerCase() === "francisco mouanga agr") {
      setIsAuthenticated(true);
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${adminName}`,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Nom administrateur incorrect.",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (agents.length >= MAX_USERS) {
      toast({
        title: "Limite atteinte",
        description: `Vous ne pouvez pas créer plus de ${MAX_USERS} utilisateurs.`,
        variant: "destructive",
      });
      return;
    }

    const newUser = {
      id: agents.length + 1,
      name: newName,
      agentId: newRole === "admin_secondaire" ? `ADM-SEC-00${agents.length + 1}` : `AG-2024-00${agents.length + 1}`,
      role: newRole === "admin_secondaire" ? "Administrateur Secondaire" : "agent"
    };

    setAgents([...agents, newUser]);
    setNewName("");
    toast({
      title: "Utilisateur créé",
      description: `${newRole === "admin_secondaire" ? "L'administrateur" : "L'agent"} ${newName} a été ajouté.`,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex flex-col items-center gap-2">
              <LogIn className="w-8 h-8 text-primary" />
              Connexion Administrative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Entrez votre nom complet</Label>
                <Input
                  id="admin-name"
                  type="password"
                  placeholder="••••••••••••••••"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full h-12">
                Se connecter
              </Button>
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => setLocation("/profile")}
              >
                Retour
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Nouvel Utilisateur ({agents.length}/{MAX_USERS})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Nom complet</Label>
                <Input
                  id="user-name"
                  placeholder="Ex: Jean Dupont"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={agents.length >= MAX_USERS}
                />
              </div>
              <div className="space-y-2">
                <Label>Type de compte</Label>
                <Select 
                  value={newRole} 
                  onValueChange={(v: any) => setNewRole(v)}
                  disabled={agents.length >= MAX_USERS}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="admin_secondaire">Administrateur Secondaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12"
                disabled={!newName || agents.length >= MAX_USERS}
              >
                Créer l'utilisateur
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Liste des accès
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

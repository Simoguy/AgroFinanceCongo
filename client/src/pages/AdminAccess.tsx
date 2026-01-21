import { useState, useEffect } from "react";
import { ArrowLeft, UserPlus, Shield, User, LogIn, Trash2, Key } from "lucide-react";
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

import { useAuth } from "@/lib/auth";

export default function AdminAccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState("");
  
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem("agro_finance_agents");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Lesly Muamba", agentId: "AG-2024-001", role: "agent", code: "1234" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("agro_finance_agents", JSON.stringify(agents));
  }, [agents]);

  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newRole, setNewRole] = useState<"agent" | "admin_secondaire">("agent");
  const MAX_USERS = 5;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(adminName)) {
      setIsAuthenticated(true);
      toast({
        title: "Accès autorisé",
        description: "Gestion des accès déverrouillée.",
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

    if (!newCode || newCode.length < 4) {
      toast({
        title: "Erreur",
        description: "Le code doit contenir au moins 4 caractères.",
        variant: "destructive",
      });
      return;
    }

    const newUser = {
      id: Date.now(),
      name: newName,
      code: newCode,
      agentId: newRole === "admin_secondaire" ? `ADM-SEC-00${agents.length + 1}` : `AG-2024-00${agents.length + 1}`,
      role: newRole === "admin_secondaire" ? "Administrateur Secondaire" : "agent"
    };

    setAgents([...agents, newUser]);
    setNewName("");
    setNewCode("");
    toast({
      title: "Utilisateur créé",
      description: `${newRole === "admin_secondaire" ? "L'administrateur" : "L'agent"} ${newName} a été ajouté.`,
    });
  };

  const handleDeleteUser = (id: number) => {
    setAgents((prevAgents: any[]) => prevAgents.filter((a: any) => a.id !== id));
    toast({
      title: "Utilisateur supprimé",
      description: "L'accès a été révoqué avec succès.",
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
                <Label htmlFor="user-code">Code secret (pour connexion)</Label>
                <div className="relative">
                  <Input
                    id="user-code"
                    type="password"
                    placeholder="••••"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    disabled={agents.length >= MAX_USERS}
                    className="pl-10"
                  />
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
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
                disabled={!newName || !newCode || agents.length >= MAX_USERS}
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
            {agents.map((agent: any) => (
              <Card key={agent.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{agent.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{agent.agentId}</p>
                        <Badge variant="outline" className="text-[10px] h-4">{agent.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteUser(agent.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

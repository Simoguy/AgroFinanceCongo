import { useLocation } from "wouter";
import { ArrowLeft, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Agent } from "@shared/schema";

export default function AgentPortfolios() {
  const [, setLocation] = useLocation();
  
  // In a real app, this would fetch from the database
  // For now, we use the same mock/localStorage logic as AdminAccess
  const savedAgents = localStorage.getItem("agro_finance_agents");
  const agents: Agent[] = savedAgents ? JSON.parse(savedAgents) : [
    { id: "1", name: "Lesly Muamba", agentId: "AG-2024-001", role: "agent" },
  ];

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-card-foreground">
            Portefeuilles Agents
          </h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {agents.map((agent) => (
          <Card 
            key={agent.id} 
            className="hover-elevate cursor-pointer"
            onClick={() => setLocation(`/agent-portfolio/${agent.agentId}`)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.agentId}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

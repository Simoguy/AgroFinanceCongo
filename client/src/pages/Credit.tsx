import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import ClientListItem from "@/components/ClientListItem";

export default function Credit() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const clients = [
    {
      id: "1",
      name: "Marie Kamanga",
      phone: "+243 812 345 678",
      amount: "1,500 FC",
      status: "active" as const,
    },
    {
      id: "2",
      name: "Jean-Paul Mbala",
      phone: "+243 899 234 567",
      amount: "3,200 FC",
      status: "warning" as const,
    },
    {
      id: "3",
      name: "Grace Mulamba",
      phone: "+243 823 456 789",
      amount: "850 FC",
      status: "active" as const,
    },
    {
      id: "4",
      name: "Daniel Tshisekedi",
      phone: "+243 815 678 901",
      amount: "2,100 FC",
      status: "active" as const,
    },
  ];

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-card-foreground">Crédit</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher un client..."
        />

        <div className="space-y-1">
          {filteredClients.map((client) => (
            <ClientListItem
              key={client.id}
              name={client.name}
              phone={client.phone}
              amount={client.amount}
              status={client.status}
              onClick={() => console.log(`Client ${client.name} clicked`)}
            />
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun client trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}

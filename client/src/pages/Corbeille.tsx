import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import ClientListItem from "@/components/ClientListItem";

export default function Corbeille() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const clients = [
    {
      id: "1",
      name: "François Kabila",
      phone: "+242 06 111 2222",
      amount: "0 FC",
      status: "settled" as const,
    },
    {
      id: "2",
      name: "Elisabeth Nzuzi",
      phone: "+242 06 333 4444",
      amount: "0 FC",
      status: "settled" as const,
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
          <h1 className="text-2xl font-bold text-card-foreground">Corbeille</h1>
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
              onClick={() => console.log(`Restore client ${client.name}`)}
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

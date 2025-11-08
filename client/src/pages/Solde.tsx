import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TabSelector from "@/components/TabSelector";
import ClientListItem from "@/components/ClientListItem";
import SearchBar from "@/components/SearchBar";

export default function Solde() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("credit");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "credit", label: "Crédit soldé" },
    { id: "savings", label: "Épargne soldé" },
  ];

  const creditClients = [
    {
      id: "1",
      name: "Joseph Mwamba",
      phone: "+243 812 345 678",
      amount: "0 FC",
      status: "settled" as const,
    },
    {
      id: "2",
      name: "Marie Kasongo",
      phone: "+243 890 234 567",
      amount: "0 FC",
      status: "settled" as const,
    },
  ];

  const savingsClients = [
    {
      id: "3",
      name: "Pierre Mukendi",
      phone: "+243 876 543 210",
      amount: "0 FC",
      status: "settled" as const,
    },
  ];

  const currentClients = activeTab === "credit" ? creditClients : savingsClients;

  const filteredClients = currentClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-card-foreground">Soldé</h1>
        </div>
        <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
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

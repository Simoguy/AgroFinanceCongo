import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TabSelector from "@/components/TabSelector";
import ClientListItem from "@/components/ClientListItem";
import SearchBar from "@/components/SearchBar";

export default function Epargne() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("scorecard");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "scorecard", label: "Carte de pointage" },
    { id: "account", label: "Compte courant" },
  ];

  const scorecardClients = [
    {
      id: "1",
      name: "Sylvie Kabongo",
      phone: "+243 890 123 456",
      amount: "4,200 FC",
      status: "active" as const,
    },
    {
      id: "2",
      name: "Patrick Lumbu",
      phone: "+243 876 543 210",
      amount: "2,800 FC",
      status: "active" as const,
    },
  ];

  const accountClients = [
    {
      id: "3",
      name: "Thérèse Mbuyi",
      phone: "+243 845 678 912",
      amount: "6,500 FC",
      status: "active" as const,
    },
    {
      id: "4",
      name: "Antoine Kalala",
      phone: "+243 823 789 456",
      amount: "3,100 FC",
      status: "active" as const,
    },
  ];

  const currentClients =
    activeTab === "scorecard" ? scorecardClients : accountClients;

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
          <h1 className="text-2xl font-bold text-card-foreground">Épargne</h1>
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

import { useState } from "react";
import TabSelector from "../TabSelector";

export default function TabSelectorExample() {
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
    { id: "tab1", label: "Carte de pointage" },
    { id: "tab2", label: "Compte courant" },
  ];

  return (
    <div className="p-4">
      <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-4 p-4 bg-card border border-card-border rounded-md">
        <p className="text-muted-foreground">
          Active tab: <span className="font-medium text-foreground">{activeTab}</span>
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import FormTypeSelector from "../FormTypeSelector";

export default function FormTypeSelectorExample() {
  const [selectedType, setSelectedType] = useState("credit");

  const types = [
    { id: "credit", label: "Crédit" },
    { id: "account", label: "Compte courant" },
    { id: "scorecard", label: "Carte de pointage" },
  ];

  return (
    <div className="p-4">
      <FormTypeSelector
        types={types}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />
      <p className="mt-4 text-sm text-muted-foreground">
        Type sélectionné: <span className="font-medium text-foreground">{selectedType}</span>
      </p>
    </div>
  );
}

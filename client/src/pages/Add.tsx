import { useLocation } from "wouter";
import { CreditCard, Wallet, FileText } from "lucide-react";

export default function Add() {
  const [, setLocation] = useLocation();

  const formTypes = [
    {
      id: "credit",
      icon: CreditCard,
      label: "Crédit",
      description: "Nouveau crédit client",
      path: "/add/credit",
    },
    {
      id: "compte-courant",
      icon: Wallet,
      label: "Compte courant",
      description: "Nouveau compte courant",
      path: "/add/compte-courant",
    },
    {
      id: "carte-pointage",
      icon: FileText,
      label: "Carte de pointage",
      description: "Nouvelle carte de pointage",
      path: "/add/carte-pointage",
    },
  ];

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <h1 className="text-2xl font-bold text-card-foreground">
          Nouveau Client
        </h1>
      </header>

      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Sélectionnez le type de compte à créer
        </p>

        <div className="space-y-3">
          {formTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setLocation(type.path)}
                data-testid={`button-${type.id}`}
                className="w-full flex items-center gap-4 p-6 bg-card border border-card-border rounded-md hover-elevate active-elevate-2"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-lg font-semibold text-card-foreground">
                    {type.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

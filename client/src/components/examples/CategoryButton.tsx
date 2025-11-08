import CategoryButton from "../CategoryButton";
import { CreditCard, Wallet, CheckCircle2, AlertTriangle, TrendingUp, Trash2 } from "lucide-react";

export default function CategoryButtonExample() {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <CategoryButton
        icon={CreditCard}
        label="Crédit"
        count={15}
        onClick={() => console.log("Crédit clicked")}
      />
      <CategoryButton
        icon={Wallet}
        label="Épargne"
        count={8}
        onClick={() => console.log("Épargne clicked")}
      />
      <CategoryButton
        icon={CheckCircle2}
        label="Soldé"
        count={42}
        onClick={() => console.log("Soldé clicked")}
      />
      <CategoryButton
        icon={AlertTriangle}
        label="Contencieux"
        count={3}
        onClick={() => console.log("Contencieux clicked")}
      />
      <CategoryButton
        icon={TrendingUp}
        label="Performance"
        onClick={() => console.log("Performance clicked")}
      />
      <CategoryButton
        icon={Trash2}
        label="Corbeille"
        count={2}
        onClick={() => console.log("Corbeille clicked")}
      />
    </div>
  );
}

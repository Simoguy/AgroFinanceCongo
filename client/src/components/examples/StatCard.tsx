import StatCard from "../StatCard";

export default function StatCardExample() {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <StatCard
        label="Total Crédits"
        value="25,400 FC"
        trend={{ value: "12%", isPositive: true }}
      />
      <StatCard
        label="Clients Actifs"
        value="42"
        trend={{ value: "5%", isPositive: true }}
      />
      <StatCard
        label="En Retard"
        value="3"
        trend={{ value: "2", isPositive: false }}
      />
      <StatCard label="Taux de Recouvrement" value="94%" />
    </div>
  );
}

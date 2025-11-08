interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="bg-card border border-card-border rounded-md p-4 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-3xl font-bold text-card-foreground tabular-nums">
        {value}
      </p>
      {trend && (
        <p
          className={`text-sm font-medium ${
            trend.isPositive ? "text-primary" : "text-destructive"
          }`}
        >
          {trend.isPositive ? "↑" : "↓"} {trend.value}
        </p>
      )}
    </div>
  );
}

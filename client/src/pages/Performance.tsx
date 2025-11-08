import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Performance() {
  const [, setLocation] = useLocation();

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
          <h1 className="text-2xl font-bold text-card-foreground">
            Performance
          </h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Vue d'ensemble
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Total Crédits"
              value="25,400 FC"
              trend={{ value: "12%", isPositive: true }}
            />
            <StatCard
              label="Total Épargne"
              value="16,600 FC"
              trend={{ value: "8%", isPositive: true }}
            />
            <StatCard
              label="Clients Actifs"
              value="42"
              trend={{ value: "5%", isPositive: true }}
            />
            <StatCard
              label="Taux Recouvrement"
              value="94%"
              trend={{ value: "3%", isPositive: true }}
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Ce mois
          </h2>
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Nouveaux clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-card-foreground">12</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Crédits accordés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-card-foreground">8</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Comptes soldés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-card-foreground">15</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
    console.log("Theme toggled:", !isDark ? "dark" : "light");
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <h1 className="text-2xl font-bold text-card-foreground">Profil</h1>
      </header>

      <div className="p-4 space-y-6">
        <div className="flex flex-col items-center pt-6 pb-4">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
              LM
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-foreground">Lesly Muamba</h2>
          <p className="text-sm text-muted-foreground">AG-2024-001</p>
        </div>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Informations
          </h3>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Téléphone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-card-foreground">+243 812 345 678</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Région
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-card-foreground">Kinshasa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Date d'inscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-card-foreground">15 janvier 2024</p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Paramètres</h3>

          <Button
            variant="outline"
            className="w-full h-12 justify-start gap-3"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span>{isDark ? "Mode clair" : "Mode sombre"}</span>
          </Button>

          <Button
            variant="destructive"
            className="w-full h-12 justify-start gap-3"
            data-testid="button-logout"
            onClick={() => console.log("Logout clicked")}
          >
            <LogOut className="w-5 h-5" />
            <span>Se déconnecter</span>
          </Button>
        </section>
      </div>
    </div>
  );
}

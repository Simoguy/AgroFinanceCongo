import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Moon, Sun, ShieldCheck, Users, Bell, BellOff } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/lib/auth";

export default function Profile() {
  const [isDark, setIsDark] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const currentUser = user || {
    name: "Direction AGR",
    role: "admin",
    agentId: "ADM-MAIN"
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
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
              AGR
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-foreground">{currentUser.name}</h2>
          <div className="flex flex-col items-center gap-1 mt-1">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">
              ADMINISTRATEUR PRINCIPAL
            </Badge>
          </div>
        </div>

        {currentUser.role === "admin" && (
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Administration
            </h3>
            <Button
              className="w-full h-12 justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20 border-none"
              onClick={() => setLocation("/admin/access")}
              data-testid="button-manage-access"
            >
              <Users className="w-5 h-5" />
              <span>Gestion accès</span>
            </Button>
          </section>
        )}

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Paramètres</h3>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notificationsEnabled ? <Bell className="w-5 h-5 text-primary" /> : <BellOff className="w-5 h-5 text-muted-foreground" />}
                <Label htmlFor="notifications" className="cursor-pointer">Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </CardContent>
          </Card>

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
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span>Se déconnecter</span>
          </Button>
        </section>
      </div>
    </div>
  );
}

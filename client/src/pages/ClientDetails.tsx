import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Phone, MapPin, Tag, Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Credit, CompteCourant, CartePointage } from "@shared/schema";

export default function ClientDetails() {
  const [, params] = useRoute("/client/:type/:id");
  const [, setLocation] = useLocation();
  const { type, id } = params || {};

  const { data: client, isLoading } = useQuery<Credit | CompteCourant | CartePointage>({
    queryKey: [`/api/${type}s`, id],
    queryFn: async () => {
      const res = await fetch(`/api/${type}s/${id}`);
      if (!res.ok) throw new Error("Client not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Client introuvable</p>
        <Button onClick={() => setLocation("/")}>Retour à l'accueil</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-card-foreground">
            Détails du Client
          </h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">
                {client.nom} {client.prenom}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {client.code}
                </Badge>
                <Badge className="bg-primary/20 text-primary border-none text-xs">
                  {client.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{client.telephone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{client.adresse} ({client.zone})</span>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{client.activite}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Créé le {new Date(client.dateCreation).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-3">
              <Button className="flex-1 gap-2" data-testid="button-versement">
                <PlusCircle className="w-4 h-4" />
                Versement
              </Button>
              <Button variant="outline" className="flex-1">
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>

        {type === "credit" && (client as Credit).nombreCompte && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Informations Crédit</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Nombre de comptes</p>
                <p className="font-semibold">{(client as Credit).nombreCompte}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Échéance</p>
                <p className="font-semibold">{(client as Credit).echeance} jours</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Garantie</p>
                <p className="font-semibold">{(client as Credit).garantie}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {type === "carte-pointage" && (client as CartePointage).montant && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Informations Carte</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-xs text-muted-foreground">Montant Journalier</p>
                <p className="text-2xl font-bold text-primary">
                  {parseInt((client as CartePointage).montant).toLocaleString()} FC
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

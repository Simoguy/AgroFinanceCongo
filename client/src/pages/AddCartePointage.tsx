import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCartePointageSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { SyncManager } from "@/lib/syncManager";

const formSchema = insertCartePointageSchema.extend({
  dateCreation: z.string().min(1, "La date de création est requise"),
  montant: z.string().min(1, "Le montant est requis"),
});

const zones = [
  "Marché Total",
  "Marché Tchimbamba",
  "Marché Tié-Tié",
  "Marché Mvoumvou",
  "Marché Rex",
  "Marché Bloc",
  "Centre-ville",
  "Lumumba",
  "Mongo Mpoukou",
  "Moukondo",
  "Ngoyo",
  "Loandjili",
];

export default function AddCartePointage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [codeCompte, setCodeCompte] = useState("");

  useEffect(() => {
    const generateCode = () => {
      const year = new Date().getFullYear().toString().slice(-2);
      const random = Math.floor(1000 + Math.random() * 9000);
      return `CP-${year}${random}`;
    };
    setCodeCompte(generateCode());
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      telephone: "",
      activite: "",
      adresse: "",
      zone: "",
      montant: "",
      dateCreation: "",
      code: "",
      agentId: "default-agent",
    },
  });

  const createCarteMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const payload = {
        ...data,
        code: codeCompte,
        montant: data.montant.toString(),
        dateCreation: new Date(data.dateCreation).toISOString(),
      };

      if (!navigator.onLine) {
        SyncManager.addToQueue({
          type: "CREATE_CARTE_POINTAGE",
          payload
        });
        return { success: true, offline: true };
      }

      console.log("Sending payload:", payload);
      const response = await fetch("/api/carte-pointages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create carte pointage");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/carte-pointages"] });
      toast({
        title: "Succès",
        description: data.offline ? "Enregistré localement (en attente de connexion)" : "Carte de pointage créée avec succès",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Échec de la création de la carte de pointage",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createCarteMutation.mutate(data);
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/add")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-card-foreground">
            Nouvelle Carte de Pointage
          </h1>
        </div>
      </header>

      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Kamanga"
                      className="h-12"
                      data-testid="input-nom"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Marie"
                      className="h-12"
                      data-testid="input-prenom"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+242 06 123 4567"
                      className="h-12"
                      data-testid="input-telephone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activité</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Commerce de légumes"
                      className="h-12"
                      data-testid="input-activite"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Avenue de la Paix"
                      className="h-12"
                      data-testid="input-adresse"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12" data-testid="select-zone">
                        <SelectValue placeholder="Sélectionner une zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Code du compte</FormLabel>
              <div className="h-12 px-3 rounded-md border border-input bg-muted flex items-center">
                <span className="text-base font-medium text-foreground">
                  {codeCompte}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Généré automatiquement
              </p>
            </div>

            <FormField
              control={form.control}
              name="montant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (FC)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Ex: 5000"
                      className="h-12"
                      data-testid="input-montant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateCreation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date création</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="h-12"
                      data-testid="input-date-creation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12"
              data-testid="button-submit"
              disabled={createCarteMutation.isPending}
            >
              {createCarteMutation.isPending ? "Création..." : "Créer la carte de pointage"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

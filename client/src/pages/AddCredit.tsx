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
import { insertCreditSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { SyncManager } from "@/lib/syncManager";

const formSchema = insertCreditSchema.extend({
  nombreCompte: z.coerce.number().min(1, "Le nombre de compte est requis"),
  dateCreation: z.string().min(1, "La date de création est requise"),
  echeance: z.coerce.number().min(1, "L'échéance est requise"),
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

import { useAuth } from "@/lib/auth";

export default function AddCredit() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [codeCompte, setCodeCompte] = useState("");

  useEffect(() => {
    const generateCode = () => {
      const year = new Date().getFullYear().toString().slice(-2);
      const random = Math.floor(1000 + Math.random() * 9000);
      return `CR-${year}${random}`;
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
      nombreCompte: 0,
      dateCreation: "",
      garantie: "",
      echeance: 0,
      code: "",
      agentId: user?.agentId || "default-agent",
    },
  });

  const createCreditMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const payload = {
        ...data,
        code: codeCompte,
        dateCreation: new Date(data.dateCreation).toISOString(),
      };

      if (!navigator.onLine) {
        SyncManager.addToQueue({
          type: "CREATE_CREDIT",
          payload
        });
        return { success: true, offline: true };
      }

      const response = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create credit");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
      toast({
        title: "Succès",
        description: data.offline ? "Enregistré localement (en attente de connexion)" : "Crédit créé avec succès",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Échec de la création du crédit",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createCreditMutation.mutate(data);
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
            Nouveau Crédit
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
              name="nombreCompte"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de compte</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Ex: 1"
                      className="h-12"
                      data-testid="input-nombre-compte"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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

            <FormField
              control={form.control}
              name="garantie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garantie</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Matériel de commerce"
                      className="h-12"
                      data-testid="input-garantie"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="echeance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Échéance (jours)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="h-12"
                        data-testid="select-echeance"
                      >
                        <SelectValue placeholder="Sélectionner l'échéance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="31">31 jours</SelectItem>
                      <SelectItem value="45">45 jours</SelectItem>
                      <SelectItem value="62">62 jours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12"
              data-testid="button-submit"
              disabled={createCreditMutation.isPending}
            >
              {createCreditMutation.isPending ? "Création..." : "Créer le crédit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

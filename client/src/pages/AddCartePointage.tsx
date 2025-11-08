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
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const cartePointageSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  telephone: z.string().min(10, "Numéro de téléphone invalide"),
  activite: z.string().min(2, "L'activité est requise"),
  adresse: z.string().min(5, "L'adresse est requise"),
  zone: z.string().min(1, "La zone est requise"),
  nombreCompte: z.string().min(1, "Le nombre de compte est requis"),
  montant: z.string().min(1, "Le montant est requis"),
  dateCreation: z.string().min(1, "La date de création est requise"),
  garantie: z.string().min(2, "La garantie est requise"),
  echeance: z.string().min(1, "L'échéance est requise"),
});

const zones = [
  "Marché Total",
  "Marché Plateau des 15 ans",
  "Marché Tchimbamba",
  "Marché Tié-Tié",
  "Marché Mvoumvou",
  "Marché Rex",
  "Marché Bloc",
  "Centre-ville",
  "Lumumba",
  "Mongo Mpoukou",
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
    resolver: zodResolver(cartePointageSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      telephone: "",
      activite: "",
      adresse: "",
      zone: "",
      nombreCompte: "",
      montant: "",
      dateCreation: "",
      garantie: "",
      echeance: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Carte de pointage form submitted:", { ...data, codeCompte });
    toast({
      title: "Succès",
      description: "Carte de pointage créée avec succès",
    });
    setLocation("/add");
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
                      placeholder="+243 812 345 678"
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
            >
              Créer la carte de pointage
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

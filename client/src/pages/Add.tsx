import { useState } from "react";
import FormTypeSelector from "@/components/FormTypeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const creditSchema = z.object({
  clientName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  address: z.string().min(5, "L'adresse est requise"),
  amount: z.string().min(1, "Le montant est requis"),
  interestRate: z.string().min(1, "Le taux d'intérêt est requis"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
});

const accountSchema = z.object({
  clientName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  address: z.string().min(5, "L'adresse est requise"),
  initialDeposit: z.string().min(1, "Le dépôt initial est requis"),
});

const scorecardSchema = z.object({
  clientName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  address: z.string().min(5, "L'adresse est requise"),
  savingsGoal: z.string().min(1, "L'objectif d'épargne est requis"),
});

export default function Add() {
  const [formType, setFormType] = useState("credit");
  const { toast } = useToast();

  const formTypes = [
    { id: "credit", label: "Crédit" },
    { id: "account", label: "Compte courant" },
    { id: "scorecard", label: "Carte de pointage" },
  ];

  const getSchema = () => {
    switch (formType) {
      case "credit":
        return creditSchema;
      case "account":
        return accountSchema;
      case "scorecard":
        return scorecardSchema;
      default:
        return creditSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      clientName: "",
      phone: "",
      address: "",
      amount: "",
      interestRate: "",
      dueDate: "",
      initialDeposit: "",
      savingsGoal: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    toast({
      title: "Succès",
      description: `${formTypes.find((t) => t.id === formType)?.label} créé avec succès`,
    });
    form.reset();
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border px-4 py-4">
        <h1 className="text-2xl font-bold text-card-foreground">
          Nouveau Client
        </h1>
      </header>

      <div className="p-4 space-y-6">
        <FormTypeSelector
          types={formTypes}
          selectedType={formType}
          onTypeChange={(type) => {
            setFormType(type);
            form.reset();
          }}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du client</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Marie Kamanga"
                      className="h-12"
                      data-testid="input-client-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+243 812 345 678"
                      className="h-12"
                      data-testid="input-phone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Avenue Lubumbashi, Kinshasa"
                      className="h-12"
                      data-testid="input-address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formType === "credit" && (
              <>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant du crédit (FC)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 5000"
                          className="h-12"
                          data-testid="input-amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taux d'intérêt (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 5"
                          className="h-12"
                          data-testid="input-interest-rate"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'échéance</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-12"
                          data-testid="input-due-date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {formType === "account" && (
              <FormField
                control={form.control}
                name="initialDeposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dépôt initial (FC)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 1000"
                        className="h-12"
                        data-testid="input-initial-deposit"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {formType === "scorecard" && (
              <FormField
                control={form.control}
                name="savingsGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objectif d'épargne (FC)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 10000"
                        className="h-12"
                        data-testid="input-savings-goal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full h-12"
              data-testid="button-submit"
            >
              Créer
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

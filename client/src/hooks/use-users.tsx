import { useQuery } from "@tanstack/react-query";
import { Credit, CompteCourant, CartePointage } from "@shared/schema";

export function useUsers() {
  const { data: credits = [], isLoading: loadingCredits } = useQuery<Credit[]>({ queryKey: ["/api/credits"] });
  const { data: comptes = [], isLoading: loadingComptes } = useQuery<CompteCourant[]>({ queryKey: ["/api/compte-courants"] });
  const { data: cartes = [], isLoading: loadingCartes } = useQuery<CartePointage[]>({ queryKey: ["/api/carte-pointages"] });

  const isLoading = loadingCredits || loadingComptes || loadingCartes;

  const users = [
    ...credits.map(c => ({
      id: c.id,
      name: c.nom,
      firstName: c.prenom,
      role: 'client' as const,
      isSolded: c.status === 'solde',
      isContencieux: c.status === 'contentieux',
      accountCount: c.nombreCompte,
      mise: 0
    })),
    ...comptes.map(c => ({
      id: c.id,
      name: c.nom,
      firstName: c.prenom,
      role: 'compte_courant' as const,
      isSolded: c.status === 'solde',
      isContencieux: c.status === 'contentieux',
      accountCount: 1,
      mise: 0
    })),
    ...cartes.map(c => ({
      id: c.id,
      name: c.nom,
      firstName: c.prenom,
      role: 'carte_pointage' as const,
      isSolded: c.status === 'solde',
      isContencieux: c.status === 'contentieux',
      accountCount: 1,
      mise: Number(c.montant)
    }))
  ];

  return {
    data: users,
    isLoading
  };
}

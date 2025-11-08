import {
  type Agent,
  type InsertAgent,
  type Credit,
  type InsertCredit,
  type CompteCourant,
  type InsertCompteCourant,
  type CartePointage,
  type InsertCartePointage,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAgent(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  
  getCredits(agentId?: string, status?: string): Promise<Credit[]>;
  getCredit(id: string): Promise<Credit | undefined>;
  createCredit(credit: InsertCredit): Promise<Credit>;
  updateCreditStatus(id: string, status: string): Promise<Credit | undefined>;
  deleteCredit(id: string): Promise<void>;
  
  getCompteCourants(agentId?: string, status?: string): Promise<CompteCourant[]>;
  getCompteCourant(id: string): Promise<CompteCourant | undefined>;
  createCompteCourant(compte: InsertCompteCourant): Promise<CompteCourant>;
  updateCompteCourantStatus(id: string, status: string): Promise<CompteCourant | undefined>;
  deleteCompteCourant(id: string): Promise<void>;
  
  getCartePointages(agentId?: string, status?: string): Promise<CartePointage[]>;
  getCartePointage(id: string): Promise<CartePointage | undefined>;
  createCartePointage(carte: InsertCartePointage): Promise<CartePointage>;
  updateCartePointageStatus(id: string, status: string): Promise<CartePointage | undefined>;
  deleteCartePointage(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private agents: Map<string, Agent>;
  private credits: Map<string, Credit>;
  private compteCourants: Map<string, CompteCourant>;
  private cartePointages: Map<string, CartePointage>;

  constructor() {
    this.agents = new Map();
    this.credits = new Map();
    this.compteCourants = new Map();
    this.cartePointages = new Map();
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const agent: Agent = { ...insertAgent, id };
    this.agents.set(id, agent);
    return agent;
  }

  async getCredits(agentId?: string, status?: string): Promise<Credit[]> {
    let credits = Array.from(this.credits.values()).filter(
      (credit) => !credit.isDeleted
    );
    
    if (agentId) {
      credits = credits.filter((credit) => credit.agentId === agentId);
    }
    
    if (status) {
      credits = credits.filter((credit) => credit.status === status);
    }
    
    return credits;
  }

  async getCredit(id: string): Promise<Credit | undefined> {
    return this.credits.get(id);
  }

  async createCredit(insertCredit: InsertCredit): Promise<Credit> {
    const id = randomUUID();
    const credit: Credit = {
      ...insertCredit,
      id,
      status: "actif",
      isDeleted: false,
      deletedAt: null,
    };
    this.credits.set(id, credit);
    return credit;
  }

  async updateCreditStatus(id: string, status: string): Promise<Credit | undefined> {
    const credit = this.credits.get(id);
    if (credit) {
      credit.status = status;
      this.credits.set(id, credit);
      return credit;
    }
    return undefined;
  }

  async deleteCredit(id: string): Promise<void> {
    const credit = this.credits.get(id);
    if (credit) {
      credit.isDeleted = true;
      credit.deletedAt = new Date();
      this.credits.set(id, credit);
    }
  }

  async getCompteCourants(agentId?: string, status?: string): Promise<CompteCourant[]> {
    let comptes = Array.from(this.compteCourants.values()).filter(
      (compte) => !compte.isDeleted
    );
    
    if (agentId) {
      comptes = comptes.filter((compte) => compte.agentId === agentId);
    }
    
    if (status) {
      comptes = comptes.filter((compte) => compte.status === status);
    }
    
    return comptes;
  }

  async getCompteCourant(id: string): Promise<CompteCourant | undefined> {
    return this.compteCourants.get(id);
  }

  async createCompteCourant(insertCompte: InsertCompteCourant): Promise<CompteCourant> {
    const id = randomUUID();
    const compte: CompteCourant = {
      ...insertCompte,
      id,
      status: "actif",
      isDeleted: false,
      deletedAt: null,
    };
    this.compteCourants.set(id, compte);
    return compte;
  }

  async updateCompteCourantStatus(id: string, status: string): Promise<CompteCourant | undefined> {
    const compte = this.compteCourants.get(id);
    if (compte) {
      compte.status = status;
      this.compteCourants.set(id, compte);
      return compte;
    }
    return undefined;
  }

  async deleteCompteCourant(id: string): Promise<void> {
    const compte = this.compteCourants.get(id);
    if (compte) {
      compte.isDeleted = true;
      compte.deletedAt = new Date();
      this.compteCourants.set(id, compte);
    }
  }

  async getCartePointages(agentId?: string, status?: string): Promise<CartePointage[]> {
    let cartes = Array.from(this.cartePointages.values()).filter(
      (carte) => !carte.isDeleted
    );
    
    if (agentId) {
      cartes = cartes.filter((carte) => carte.agentId === agentId);
    }
    
    if (status) {
      cartes = cartes.filter((carte) => carte.status === status);
    }
    
    return cartes;
  }

  async getCartePointage(id: string): Promise<CartePointage | undefined> {
    return this.cartePointages.get(id);
  }

  async createCartePointage(insertCarte: InsertCartePointage): Promise<CartePointage> {
    const id = randomUUID();
    const carte: CartePointage = {
      ...insertCarte,
      id,
      status: "actif",
      isDeleted: false,
      deletedAt: null,
    };
    this.cartePointages.set(id, carte);
    return carte;
  }

  async updateCartePointageStatus(id: string, status: string): Promise<CartePointage | undefined> {
    const carte = this.cartePointages.get(id);
    if (carte) {
      carte.status = status;
      this.cartePointages.set(id, carte);
      return carte;
    }
    return undefined;
  }

  async deleteCartePointage(id: string): Promise<void> {
    const carte = this.cartePointages.get(id);
    if (carte) {
      carte.isDeleted = true;
      carte.deletedAt = new Date();
      this.cartePointages.set(id, carte);
    }
  }
}

export const storage = new MemStorage();

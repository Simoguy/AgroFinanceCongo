import {
  type Agent,
  type InsertAgent,
  type Credit,
  type InsertCredit,
  type CompteCourant,
  type InsertCompteCourant,
  type CartePointage,
  type InsertCartePointage,
  type TransactionCompte,
  type InsertTransactionCompte,
  type TransactionCarte,
  type InsertTransactionCarte,
  agents,
  credits,
  compteCourants,
  cartePointages,
  transactionsCompte,
  transactionsCarte
} from "@shared/schema";
import { db } from "./db.js";
import { eq, and, desc, sql } from "drizzle-orm";

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
  
  getTransactionsCompte(compteId: string): Promise<TransactionCompte[]>;
  createTransactionCompte(transaction: InsertTransactionCompte): Promise<TransactionCompte>;

  getCartePointages(agentId?: string, status?: string): Promise<CartePointage[]>;
  getCartePointage(id: string): Promise<CartePointage | undefined>;
  createCartePointage(carte: InsertCartePointage): Promise<CartePointage>;
  updateCartePointageStatus(id: string, status: string): Promise<CartePointage | undefined>;
  deleteCartePointage(id: string): Promise<void>;

  getTransactionsCarte(carteId: string): Promise<TransactionCarte[]>;
  createTransactionCarte(transaction: InsertTransactionCarte): Promise<TransactionCarte>;
}

export class DatabaseStorage implements IStorage {
  // ... existing agent methods ...
  async getAgent(id: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const [agent] = await db.insert(agents).values(insertAgent).returning();
    return agent;
  }

  // ... existing credit methods ...
  async getCredits(agentId?: string, status?: string): Promise<Credit[]> {
    let query = db.select().from(credits).where(eq(credits.isDeleted, false));
    if (agentId && status) {
      query = db.select().from(credits).where(
        and(eq(credits.agentId, agentId), eq(credits.status, status), eq(credits.isDeleted, false))
      );
    } else if (agentId) {
      query = db.select().from(credits).where(and(eq(credits.agentId, agentId), eq(credits.isDeleted, false)));
    } else if (status) {
      query = db.select().from(credits).where(and(eq(credits.status, status), eq(credits.isDeleted, false)));
    }
    return await query;
  }

  async getCredit(id: string): Promise<Credit | undefined> {
    const [credit] = await db.select().from(credits).where(eq(credits.id, id));
    return credit;
  }

  async createCredit(insertCredit: InsertCredit): Promise<Credit> {
    const [credit] = await db.insert(credits).values({ 
      ...insertCredit, 
      status: "actif",
      isDeleted: false 
    }).returning();
    return credit;
  }

  async updateCreditStatus(id: string, status: string): Promise<Credit | undefined> {
    const [credit] = await db.update(credits)
      .set({ status })
      .where(eq(credits.id, id))
      .returning();
    return credit;
  }

  async deleteCredit(id: string): Promise<void> {
    await db.update(credits)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(credits.id, id));
  }

  async getCompteCourants(agentId?: string, status?: string): Promise<CompteCourant[]> {
    let query = db.select().from(compteCourants).where(eq(compteCourants.isDeleted, false));
    if (agentId && status) {
      query = db.select().from(compteCourants).where(
        and(eq(compteCourants.agentId, agentId), eq(compteCourants.status, status), eq(compteCourants.isDeleted, false))
      );
    } else if (agentId) {
      query = db.select().from(compteCourants).where(and(eq(compteCourants.agentId, agentId), eq(compteCourants.isDeleted, false)));
    } else if (status) {
      query = db.select().from(compteCourants).where(and(eq(compteCourants.status, status), eq(compteCourants.isDeleted, false)));
    }
    return await query;
  }

  async getCompteCourant(id: string): Promise<CompteCourant | undefined> {
    const [compte] = await db.select().from(compteCourants).where(eq(compteCourants.id, id));
    return compte;
  }

  async createCompteCourant(insertCompte: InsertCompteCourant): Promise<CompteCourant> {
    const [compte] = await db.insert(compteCourants).values({ 
      ...insertCompte, 
      status: "actif",
      isDeleted: false 
    }).returning();
    return compte;
  }

  async updateCompteCourantStatus(id: string, status: string): Promise<CompteCourant | undefined> {
    const [compte] = await db.update(compteCourants)
      .set({ status })
      .where(eq(compteCourants.id, id))
      .returning();
    return compte;
  }

  async deleteCompteCourant(id: string): Promise<void> {
    await db.update(compteCourants)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(compteCourants.id, id));
  }

  async getTransactionsCompte(compteId: string): Promise<TransactionCompte[]> {
    return await db.select()
      .from(transactionsCompte)
      .where(eq(transactionsCompte.compteId, compteId))
      .orderBy(desc(transactionsCompte.date));
  }

  async createTransactionCompte(insertTransaction: InsertTransactionCompte): Promise<TransactionCompte> {
    const [transaction] = await db.insert(transactionsCompte)
      .values(insertTransaction)
      .returning();

    // Update solde
    const change = insertTransaction.type === 'versement' 
      ? Number(insertTransaction.montant) 
      : -Number(insertTransaction.montant);

    await db.update(compteCourants)
      .set({ solde: sql`${compteCourants.solde} + ${change}` })
      .where(eq(compteCourants.id, insertTransaction.compteId));

    return transaction;
  }

  async getCartePointages(agentId?: string, status?: string): Promise<CartePointage[]> {
    let query = db.select().from(cartePointages).where(eq(cartePointages.isDeleted, false));
    if (agentId && status) {
      query = db.select().from(cartePointages).where(
        and(eq(cartePointages.agentId, agentId), eq(cartePointages.status, status), eq(cartePointages.isDeleted, false))
      );
    } else if (agentId) {
      query = db.select().from(cartePointages).where(and(eq(cartePointages.agentId, agentId), eq(cartePointages.isDeleted, false)));
    } else if (status) {
      query = db.select().from(cartePointages).where(and(eq(cartePointages.status, status), eq(cartePointages.isDeleted, false)));
    }
    return await query;
  }

  async getCartePointage(id: string): Promise<CartePointage | undefined> {
    const [carte] = await db.select().from(cartePointages).where(eq(cartePointages.id, id));
    return carte;
  }

  async createCartePointage(insertCarte: InsertCartePointage): Promise<CartePointage> {
    const [carte] = await db.insert(cartePointages).values({ 
      ...insertCarte, 
      status: "actif",
      isDeleted: false 
    }).returning();
    return carte;
  }

  async updateCartePointageStatus(id: string, status: string): Promise<CartePointage | undefined> {
    const [carte] = await db.update(cartePointages)
      .set({ status })
      .where(eq(cartePointages.id, id))
      .returning();
    return carte;
  }

  async deleteCartePointage(id: string): Promise<void> {
    await db.update(cartePointages)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(cartePointages.id, id));
  }

  async getTransactionsCarte(carteId: string): Promise<TransactionCarte[]> {
    return await db.select()
      .from(transactionsCarte)
      .where(eq(transactionsCarte.carteId, carteId))
      .orderBy(desc(transactionsCarte.date));
  }

  async createTransactionCarte(insertTransaction: InsertTransactionCarte): Promise<TransactionCarte> {
    const [transaction] = await db.insert(transactionsCarte)
      .values(insertTransaction)
      .returning();
    return transaction;
  }
}

export const storage = new DatabaseStorage();

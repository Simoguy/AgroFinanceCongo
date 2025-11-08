import {
  type Agent,
  type InsertAgent,
  type Client,
  type InsertClient,
  type Credit,
  type InsertCredit,
  type SavingsAccount,
  type InsertSavingsAccount,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAgent(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  getClient(id: string): Promise<Client | undefined>;
  getClients(agentId: string): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  getCredits(clientId: string): Promise<Credit[]>;
  createCredit(credit: InsertCredit): Promise<Credit>;
  getSavingsAccounts(clientId: string): Promise<SavingsAccount[]>;
  createSavingsAccount(account: InsertSavingsAccount): Promise<SavingsAccount>;
}

export class MemStorage implements IStorage {
  private agents: Map<string, Agent>;
  private clients: Map<string, Client>;
  private credits: Map<string, Credit>;
  private savingsAccounts: Map<string, SavingsAccount>;

  constructor() {
    this.agents = new Map();
    this.clients = new Map();
    this.credits = new Map();
    this.savingsAccounts = new Map();
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

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClients(agentId: string): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(
      (client) => client.agentId === agentId
    );
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = { 
      ...insertClient, 
      id,
      isDeleted: false,
      deletedAt: null,
    };
    this.clients.set(id, client);
    return client;
  }

  async deleteClient(id: string): Promise<void> {
    const client = this.clients.get(id);
    if (client) {
      client.isDeleted = true;
      client.deletedAt = new Date();
      this.clients.set(id, client);
    }
  }

  async getCredits(clientId: string): Promise<Credit[]> {
    return Array.from(this.credits.values()).filter(
      (credit) => credit.clientId === clientId
    );
  }

  async createCredit(insertCredit: InsertCredit): Promise<Credit> {
    const id = randomUUID();
    const credit: Credit = { 
      ...insertCredit, 
      id,
      isSettled: insertCredit.isSettled ?? false,
    };
    this.credits.set(id, credit);
    return credit;
  }

  async getSavingsAccounts(clientId: string): Promise<SavingsAccount[]> {
    return Array.from(this.savingsAccounts.values()).filter(
      (account) => account.clientId === clientId
    );
  }

  async createSavingsAccount(
    insertAccount: InsertSavingsAccount
  ): Promise<SavingsAccount> {
    const id = randomUUID();
    const account: SavingsAccount = { 
      ...insertAccount, 
      id,
      isSettled: insertAccount.isSettled ?? false,
      lastDepositDate: insertAccount.lastDepositDate ?? null,
    };
    this.savingsAccounts.set(id, account);
    return account;
  }
}

export const storage = new MemStorage();

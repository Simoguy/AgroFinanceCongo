import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  agentId: text("agent_id").notNull().unique(),
  phone: text("phone").notNull(),
  region: text("region").notNull(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  agentId: varchar("agent_id").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
});

export const credits = pgTable("credits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  amount: numeric("amount").notNull(),
  remainingBalance: numeric("remaining_balance").notNull(),
  interestRate: numeric("interest_rate").notNull(),
  status: text("status").notNull(),
  startDate: timestamp("start_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  isSettled: boolean("is_settled").notNull().default(false),
});

export const savingsAccounts = pgTable("savings_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  type: text("type").notNull(),
  balance: numeric("balance").notNull(),
  lastDepositDate: timestamp("last_deposit_date"),
  isSettled: boolean("is_settled").notNull().default(false),
});

export const insertAgentSchema = createInsertSchema(agents).omit({ id: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, isDeleted: true, deletedAt: true });
export const insertCreditSchema = createInsertSchema(credits).omit({ id: true });
export const insertSavingsAccountSchema = createInsertSchema(savingsAccounts).omit({ id: true });

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertCredit = z.infer<typeof insertCreditSchema>;
export type Credit = typeof credits.$inferSelect;
export type InsertSavingsAccount = z.infer<typeof insertSavingsAccountSchema>;
export type SavingsAccount = typeof savingsAccounts.$inferSelect;

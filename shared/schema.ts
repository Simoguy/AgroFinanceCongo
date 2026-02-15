import { pgTable, text, varchar, timestamp, boolean, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  agentId: text("agent_id").notNull().unique(),
  phone: text("phone").notNull(),
  region: text("region").notNull(),
  role: text("role").notNull().default("agent"), // "admin" or "agent"
  password: text("password").notNull().default("password123"),
});

export const credits = pgTable("credits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  telephone: text("telephone").notNull(),
  activite: text("activite").notNull(),
  adresse: text("adresse").notNull(),
  zone: text("zone").notNull(),
  nombreCompte: integer("nombre_compte").notNull(),
  limiteCredit: numeric("limite_credit").notNull().default("0"),
  versements: numeric("versements").notNull().default("0"),
  penalites: numeric("penalites").notNull().default("0"),
  commentaire: text("commentaire"),
  dateCreation: timestamp("date_creation").notNull(),
  garantie: text("garantie").notNull(),
  echeance: integer("echeance").notNull(),
  status: text("status").notNull().default("actif"),
  agentId: varchar("agent_id").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
});

export const remboursements = pgTable("remboursements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creditId: varchar("credit_id").notNull(),
  montant: numeric("montant").notNull(),
  type: text("type").notNull(), // "versement" or "penalite"
  date: timestamp("date").notNull().default(sql`now()`),
  agentId: varchar("agent_id").notNull(),
});

export const insertRemboursementSchema = createInsertSchema(remboursements).omit({ 
  id: true,
  date: true 
});

export type Remboursement = typeof remboursements.$inferSelect;
export type InsertRemboursement = z.infer<typeof insertRemboursementSchema>;

export const compteCourants = pgTable("compte_courants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  telephone: text("telephone").notNull(),
  activite: text("activite").notNull(),
  adresse: text("adresse").notNull(),
  zone: text("zone").notNull(),
  montant: numeric("montant").notNull().default("0"),
  dateCreation: timestamp("date_creation").notNull(),
  status: text("status").notNull().default("actif"),
  agentId: varchar("agent_id").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
});

export const cartePointages = pgTable("carte_pointages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  telephone: text("telephone").notNull(),
  activite: text("activite").notNull(),
  adresse: text("adresse").notNull(),
  zone: text("zone").notNull(),
  montant: numeric("montant").notNull(),
  dateCreation: timestamp("date_creation").notNull(),
  status: text("status").notNull().default("actif"),
  agentId: varchar("agent_id").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
});

// Helper for date validation
const dateSchema = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
}, z.date());

export const insertAgentSchema = createInsertSchema(agents).omit({ id: true });
export const insertCreditSchema = createInsertSchema(credits).omit({ 
  id: true, 
  isDeleted: true, 
  deletedAt: true,
  status: true,
  versements: true,
  penalites: true,
}).extend({
  dateCreation: dateSchema,
});
export const insertCompteCourantSchema = createInsertSchema(compteCourants).omit({ 
  id: true, 
  isDeleted: true, 
  deletedAt: true,
  status: true,
}).extend({
  dateCreation: dateSchema,
  montant: z.string().or(z.number()),
});
export const insertCartePointageSchema = createInsertSchema(cartePointages).omit({ 
  id: true, 
  isDeleted: true, 
  deletedAt: true,
  status: true,
}).extend({
  dateCreation: dateSchema,
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertCredit = z.infer<typeof insertCreditSchema>;
export type Credit = typeof credits.$inferSelect;
export type InsertCompteCourant = z.infer<typeof insertCompteCourantSchema>;
export type CompteCourant = typeof compteCourants.$inferSelect;
export type InsertCartePointage = z.infer<typeof insertCartePointageSchema>;
export type CartePointage = typeof cartePointages.$inferSelect;

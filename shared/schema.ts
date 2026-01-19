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
  dateCreation: timestamp("date_creation").notNull(),
  garantie: text("garantie").notNull(),
  echeance: integer("echeance").notNull(),
  status: text("status").notNull().default("actif"),
  agentId: varchar("agent_id").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
});

export const compteCourants = pgTable("compte_courants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  telephone: text("telephone").notNull(),
  activite: text("activite").notNull(),
  adresse: text("adresse").notNull(),
  zone: text("zone").notNull(),
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

export const insertAgentSchema = createInsertSchema(agents).omit({ id: true });
export const insertCreditSchema = createInsertSchema(credits).omit({ 
  id: true, 
  isDeleted: true, 
  deletedAt: true,
  status: true,
});
export const insertCompteCourantSchema = createInsertSchema(compteCourants).omit({ 
  id: true, 
  isDeleted: true, 
  deletedAt: true,
  status: true,
});
export const insertCartePointageSchema = createInsertSchema(cartePointages).omit({ 
  id: true, 
  isDeleted: true, 
  deletedAt: true,
  status: true,
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertCredit = z.infer<typeof insertCreditSchema>;
export type Credit = typeof credits.$inferSelect;
export type InsertCompteCourant = z.infer<typeof insertCompteCourantSchema>;
export type CompteCourant = typeof compteCourants.$inferSelect;
export type InsertCartePointage = z.infer<typeof insertCartePointageSchema>;
export type CartePointage = typeof cartePointages.$inferSelect;

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCreditSchema, insertCompteCourantSchema, insertCartePointageSchema, insertTransactionCompteSchema, insertTransactionCarteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ... existing credit routes ...
  app.get("/api/credits", async (req, res) => {
    try {
      const { agentId, status } = req.query;
      const credits = await storage.getCredits(
        agentId as string | undefined,
        status as string | undefined
      );
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credits" });
    }
  });

  app.get("/api/credits/:id", async (req, res) => {
    try {
      const credit = await storage.getCredit(req.params.id);
      if (!credit) {
        return res.status(404).json({ error: "Credit not found" });
      }
      res.json(credit);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credit" });
    }
  });

  app.post("/api/credits", async (req, res) => {
    try {
      const validatedData = insertCreditSchema.parse(req.body);
      const credit = await storage.createCredit(validatedData);
      res.status(201).json(credit);
    } catch (error) {
      console.error("Credit creation error:", error);
      res.status(400).json({ error: "Invalid credit data", details: error });
    }
  });

  app.patch("/api/credits/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const credit = await storage.updateCreditStatus(req.params.id, status);
      if (!credit) {
        return res.status(404).json({ error: "Credit not found" });
      }
      res.json(credit);
    } catch (error) {
      res.status(500).json({ error: "Failed to update credit status" });
    }
  });

  app.delete("/api/credits/:id", async (req, res) => {
    try {
      await storage.deleteCredit(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete credit" });
    }
  });

  // COMPTE COURANT ROUTES
  app.get("/api/compte-courants", async (req, res) => {
    try {
      const { agentId, status } = req.query;
      const comptes = await storage.getCompteCourants(
        agentId as string | undefined,
        status as string | undefined
      );
      res.json(comptes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch compte courants" });
    }
  });

  app.get("/api/compte-courants/:id", async (req, res) => {
    try {
      const compte = await storage.getCompteCourant(req.params.id);
      if (!compte) {
        return res.status(404).json({ error: "Compte courant not found" });
      }
      res.json(compte);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch compte courant" });
    }
  });

  app.post("/api/compte-courants", async (req, res) => {
    try {
      const validatedData = insertCompteCourantSchema.parse(req.body);
      const compte = await storage.createCompteCourant(validatedData);
      res.status(201).json(compte);
    } catch (error) {
      console.error("Compte courant creation error:", error);
      res.status(400).json({ error: "Invalid compte courant data", details: error });
    }
  });

  app.patch("/api/compte-courants/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const compte = await storage.updateCompteCourantStatus(req.params.id, status);
      if (!compte) {
        return res.status(404).json({ error: "Compte courant not found" });
      }
      res.json(compte);
    } catch (error) {
      res.status(500).json({ error: "Failed to update compte courant status" });
    }
  });

  app.delete("/api/compte-courants/:id", async (req, res) => {
    try {
      await storage.deleteCompteCourant(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete compte courant" });
    }
  });

  app.get("/api/compte-courants/:id/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsCompte(req.params.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/compte-courants/:id/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionCompteSchema.parse({
        ...req.body,
        compteId: req.params.id
      });
      const transaction = await storage.createTransactionCompte(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data", details: error });
    }
  });

  // CARTE POINTAGE ROUTES
  app.get("/api/carte-pointages", async (req, res) => {
    try {
      const { agentId, status } = req.query;
      const cartes = await storage.getCartePointages(
        agentId as string | undefined,
        status as string | undefined
      );
      res.json(cartes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch carte pointages" });
    }
  });

  app.get("/api/carte-pointages/:id", async (req, res) => {
    try {
      const carte = await storage.getCartePointage(req.params.id);
      if (!carte) {
        return res.status(404).json({ error: "Carte pointage not found" });
      }
      res.json(carte);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch carte pointage" });
    }
  });

  app.post("/api/carte-pointages", async (req, res) => {
    try {
      const validatedData = insertCartePointageSchema.parse(req.body);
      const carte = await storage.createCartePointage(validatedData);
      res.status(201).json(carte);
    } catch (error) {
      console.error("Carte pointage creation error:", error);
      res.status(400).json({ error: "Invalid carte pointage data", details: error });
    }
  });

  app.patch("/api/carte-pointages/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const carte = await storage.updateCartePointageStatus(req.params.id, status);
      if (!carte) {
        return res.status(404).json({ error: "Carte pointage not found" });
      }
      res.json(carte);
    } catch (error) {
      res.status(500).json({ error: "Failed to update carte pointage status" });
    }
  });

  app.delete("/api/carte-pointages/:id", async (req, res) => {
    try {
      await storage.deleteCartePointage(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete carte pointage" });
    }
  });

  app.get("/api/carte-pointages/:id/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsCarte(req.params.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/carte-pointages/:id/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionCarteSchema.parse({
        ...req.body,
        carteId: req.params.id
      });
      const transaction = await storage.createTransactionCarte(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data", details: error });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

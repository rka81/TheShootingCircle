import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ensureActiveChallenge } from "./challenge-manager";
import { z } from "zod";
import { 
  sessions,
  challenges,
  challengeAttempts,
  insertSessionSchema, 
  insertChallengeSchema, 
  insertChallengeAttemptSchema 
} from "@shared/schema";
import { createInsertSchema } from "drizzle-zod";

// Create update schemas for PATCH operations
const updateSessionSchema = createInsertSchema(sessions)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

const updateChallengeSchema = createInsertSchema(challenges)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

const updateChallengeAttemptSchema = createInsertSchema(challengeAttempts)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for sessions

  // Get all sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Get single session by ID
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }

      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // Create new session
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);

      // Check for active challenge and create attempt if criteria met
      const activeChallenge = await storage.getActiveChallenge();
      if (activeChallenge) {
        const isCompleted = 
          session.totalShots >= activeChallenge.goalCount && 
          session.accuracy >= activeChallenge.goalAccuracy;

        await storage.createChallengeAttempt({
          challengeId: activeChallenge.id,
          sessionId: session.id,
          sessionAccuracy: session.accuracy,
          completed: isCompleted
        });
      }

      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Update session
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }

      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Validate update data
      const validatedData = updateSessionSchema.parse(req.body);

      const updatedSession = await storage.updateSession(id, validatedData);
      res.json(updatedSession);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Delete session
  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }

      const success = await storage.deleteSession(id);
      if (!success) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete session" });
    }
  });

  // API routes for challenges

  // Get all challenges
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  // Get current active challenge
  app.get("/api/challenges/active", async (req, res) => {
    try {
      const challenge = await ensureActiveChallenge();
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active challenge" });
    }
  });

  // Get single challenge by ID
  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }

      const challenge = await storage.getChallenge(id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }

      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });

  // Create new challenge
  app.post("/api/challenges", async (req, res) => {
    try {
      const validatedData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(validatedData);
      res.status(201).json(challenge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid challenge data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });

  // Update challenge
  app.patch("/api/challenges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }

      const challenge = await storage.getChallenge(id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }

      // Validate update data
      const validatedData = updateChallengeSchema.parse(req.body);

      const updatedChallenge = await storage.updateChallenge(id, validatedData);
      res.json(updatedChallenge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid challenge data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update challenge" });
    }
  });

  // Delete challenge
  app.delete("/api/challenges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }

      const success = await storage.deleteChallenge(id);
      if (!success) {
        return res.status(404).json({ message: "Challenge not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete challenge" });
    }
  });

  // API routes for challenge attempts

  // Get challenge attempts (optionally filtered by challengeId)
  app.get("/api/challenge-attempts", async (req, res) => {
    try {
      const challengeId = req.query.challengeId ? parseInt(req.query.challengeId as string) : undefined;

      // If challengeId is provided but invalid
      if (req.query.challengeId && isNaN(challengeId as number)) {
        return res.status(400).json({ message: "Invalid challenge ID" });
      }

      const attempts = await storage.getChallengeAttempts(challengeId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge attempts" });
    }
  });

  // Create new challenge attempt
  app.post("/api/challenge-attempts", async (req, res) => {
    try {
      const validatedData = insertChallengeAttemptSchema.parse(req.body);

      // Check if challenge exists
      const challenge = await storage.getChallenge(validatedData.challengeId);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }

      // Check if session exists
      const session = await storage.getSession(validatedData.sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Determine if attempt is completed based on challenge goals
      const isCompleted = 
        session.totalShots >= challenge.goalCount && 
        session.accuracy >= challenge.goalAccuracy;

      const attempt = await storage.createChallengeAttempt({
        ...validatedData,
        completed: isCompleted
      });

      res.status(201).json(attempt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid challenge attempt data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create challenge attempt" });
    }
  });

  // Update challenge attempt
  app.patch("/api/challenge-attempts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid attempt ID" });
      }

      const attempt = await storage.getChallengeAttempt(id);
      if (!attempt) {
        return res.status(404).json({ message: "Challenge attempt not found" });
      }

      // Validate update data
      const validatedData = updateChallengeAttemptSchema.parse(req.body);

      const updatedAttempt = await storage.updateChallengeAttempt(id, validatedData);
      res.json(updatedAttempt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid challenge attempt data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update challenge attempt" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
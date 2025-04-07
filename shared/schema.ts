import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  name: text("name"),
  totalShots: integer("total_shots").notNull(),
  scoredShots: integer("scored_shots").notNull(),
  missedShots: integer("missed_shots").notNull(),
  accuracy: integer("accuracy").notNull(),
  playerName: text("player_name"),
  coachComment: text("coach_comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // "easy", "medium", "hard"
  goalCount: integer("goal_count").notNull(), // Number of shots to complete
  goalAccuracy: integer("goal_accuracy").notNull(), // Required accuracy (percentage)
  isActive: boolean("is_active").default(false).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const challengeAttempts = pgTable("challenge_attempts", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  sessionId: integer("session_id").notNull().references(() => sessions.id),
  accuracy: integer("accuracy").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(sessions)
  .omit({
    id: true,
    createdAt: true,
  })
  .transform((data) => ({
    ...data,
    // Convert undefined to null for compatibility with PostgreSQL
    name: data.name ?? null,
    playerName: data.playerName ?? null,
    coachComment: data.coachComment ?? null
  }));

export const insertChallengeSchema = createInsertSchema(challenges)
  .omit({
    id: true,
    createdAt: true,
  });

export const insertChallengeAttemptSchema = createInsertSchema(challengeAttempts)
  .omit({
    id: true,
    createdAt: true,
  });

// Define type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type InsertChallengeAttempt = z.infer<typeof insertChallengeAttemptSchema>;
export type ChallengeAttempt = typeof challengeAttempts.$inferSelect;

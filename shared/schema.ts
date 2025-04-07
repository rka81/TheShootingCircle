import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

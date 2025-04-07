import { 
  users, type User, type InsertUser, 
  sessions, type Session, type InsertSession,
  challenges, type Challenge, type InsertChallenge,
  challengeAttempts, type ChallengeAttempt, type InsertChallengeAttempt
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, ne } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Session storage methods
  getSessions(): Promise<Session[]>;
  getSession(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, session: Partial<InsertSession>): Promise<Session | undefined>;
  deleteSession(id: number): Promise<boolean>;
  
  // Challenge storage methods
  getChallenges(): Promise<Challenge[]>;
  getActiveChallenge(): Promise<Challenge | undefined>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: number, challenge: Partial<InsertChallenge>): Promise<Challenge | undefined>;
  deleteChallenge(id: number): Promise<boolean>;
  
  // Challenge attempts storage methods
  getChallengeAttempts(challengeId?: number): Promise<ChallengeAttempt[]>;
  getChallengeAttempt(id: number): Promise<ChallengeAttempt | undefined>;
  createChallengeAttempt(attempt: InsertChallengeAttempt): Promise<ChallengeAttempt>;
  updateChallengeAttempt(id: number, attempt: Partial<InsertChallengeAttempt>): Promise<ChallengeAttempt | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getSessions(): Promise<Session[]> {
    return db.select().from(sessions).orderBy(desc(sessions.createdAt));
  }

  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateSession(id: number, sessionUpdate: Partial<InsertSession>): Promise<Session | undefined> {
    const [updatedSession] = await db
      .update(sessions)
      .set(sessionUpdate)
      .where(eq(sessions.id, id))
      .returning();
    return updatedSession || undefined;
  }

  async deleteSession(id: number): Promise<boolean> {
    const result = await db
      .delete(sessions)
      .where(eq(sessions.id, id))
      .returning({ id: sessions.id });
    return result.length > 0;
  }

  async deleteAllSessions(): Promise<void> {
    await db.delete(sessions).execute();
  }

  // Challenge methods
  async getChallenges(): Promise<Challenge[]> {
    return db.select().from(challenges).orderBy(desc(challenges.createdAt));
  }

  async getActiveChallenge(): Promise<Challenge | undefined> {
    const now = new Date();
    const [challenge] = await db
      .select()
      .from(challenges)
      .where(
        and(
          eq(challenges.isActive, true),
          lte(challenges.startDate, now),
          gte(challenges.endDate, now)
        )
      );
    return challenge || undefined;
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge || undefined;
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    // If this new challenge is active, deactivate all other challenges
    if (insertChallenge.isActive) {
      await db
        .update(challenges)
        .set({ isActive: false })
        .where(eq(challenges.isActive, true));
    }

    const [challenge] = await db
      .insert(challenges)
      .values(insertChallenge)
      .returning();
    return challenge;
  }

  async updateChallenge(id: number, challengeUpdate: Partial<InsertChallenge>): Promise<Challenge | undefined> {
    // If setting this challenge to active, deactivate all other challenges
    if (challengeUpdate.isActive) {
      await db
        .update(challenges)
        .set({ isActive: false })
        .where(
          and(
            eq(challenges.isActive, true),
            ne(challenges.id, id)
          )
        );
    }

    const [updatedChallenge] = await db
      .update(challenges)
      .set(challengeUpdate)
      .where(eq(challenges.id, id))
      .returning();
    return updatedChallenge || undefined;
  }

  async deleteChallenge(id: number): Promise<boolean> {
    const result = await db
      .delete(challenges)
      .where(eq(challenges.id, id))
      .returning({ id: challenges.id });
    return result.length > 0;
  }

  // Challenge attempt methods
  async getChallengeAttempts(challengeId?: number): Promise<ChallengeAttempt[]> {
    if (challengeId) {
      return db
        .select()
        .from(challengeAttempts)
        .where(eq(challengeAttempts.challengeId, challengeId))
        .orderBy(desc(challengeAttempts.createdAt));
    }
    return db
      .select()
      .from(challengeAttempts)
      .orderBy(desc(challengeAttempts.createdAt));
  }

  async getChallengeAttempt(id: number): Promise<ChallengeAttempt | undefined> {
    const [attempt] = await db
      .select()
      .from(challengeAttempts)
      .where(eq(challengeAttempts.id, id));
    return attempt || undefined;
  }

  async createChallengeAttempt(insertAttempt: InsertChallengeAttempt): Promise<ChallengeAttempt> {
    const [attempt] = await db
      .insert(challengeAttempts)
      .values(insertAttempt)
      .returning();
    return attempt;
  }

  async updateChallengeAttempt(id: number, attemptUpdate: Partial<InsertChallengeAttempt>): Promise<ChallengeAttempt | undefined> {
    const [updatedAttempt] = await db
      .update(challengeAttempts)
      .set(attemptUpdate)
      .where(eq(challengeAttempts.id, id))
      .returning();
    return updatedAttempt || undefined;
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();

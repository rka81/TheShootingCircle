import { type Session } from "@shared/schema";

export interface SessionStats {
  totalSessions: number;
  totalShots: number;
  totalScored: number;
  averageAccuracy: number;
  highestAccuracy: number;
  mostGoalsInSession: number;
  streakDays: number;
  accuracyTrend: number;
}

export type NavPage = "home" | "newSession" | "history" | "stats" | "leaderboard";

export interface ProfileData {
  name: string;
  team?: string;
  initials: string;
}

export type TimeFilter = 'all' | 'week' | 'month' | 'high';

export interface ChartData {
  name: string;
  value: number;
}

export interface ShareData {
  sessionName: string;
  totalShots: number;
  scoredShots: number;
  missedShots: number;
  accuracy: number;
  coachComment?: string;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  description: string;
}

export type LocalSession = Session;
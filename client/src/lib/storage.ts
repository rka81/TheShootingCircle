import { type InsertSession, type Session } from "@shared/schema";
import { apiRequest } from "./queryClient";
import { SessionStats, Achievement } from "./types";

// Local storage keys
const SESSION_STORAGE_KEY = "netball-sessions";
const PROFILE_STORAGE_KEY = "netball-profile";

// Default profile initials function
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Save sessions to local storage as backup
export const saveSessionsToLocalStorage = (sessions: Session[]): void => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
};

// Get sessions from local storage (fallback if API fails)
export const getSessionsFromLocalStorage = (): Session[] => {
  const sessions = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessions) return [];
  try {
    return JSON.parse(sessions) as Session[];
  } catch (error) {
    console.error("Failed to parse sessions from local storage", error);
    return [];
  }
};

// Save user profile to local storage
export const saveProfileToLocalStorage = (name: string, team?: string): void => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ name, team, initials: getInitials(name) }));
};

// Get user profile from local storage
export const getProfileFromLocalStorage = () => {
  const profile = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!profile) return null;
  try {
    return JSON.parse(profile);
  } catch (error) {
    console.error("Failed to parse profile from local storage", error);
    return null;
  }
};

// Calculate session statistics from sessions
export const calculateStats = (sessions: Session[]): SessionStats => {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalShots: 0,
      totalScored: 0,
      averageAccuracy: 0,
      highestAccuracy: 0,
      mostGoalsInSession: 0,
      streakDays: 0,
      accuracyTrend: "–"
    };
  }

  const totalSessions = sessions.length;
  const totalShots = sessions.reduce((sum, session) => sum + session.totalShots, 0);
  const totalScored = sessions.reduce((sum, session) => sum + session.scoredShots, 0);
  const averageAccuracy = totalShots > 0 
    ? Math.round((totalScored / totalShots) * 100) 
    : 0;

  const highestAccuracy = Math.max(...sessions.map(s => s.accuracy));
  const mostGoalsInSession = Math.max(...sessions.map(s => s.scoredShots));

  // Calculate streak (consecutive days with sessions)
  let streakDays = 0;
  if (sessions.length > 0) {
    // This is a simplified streak calculation
    // A more complete implementation would check for actual consecutive calendar days
    streakDays = 1;
  }

  let accuracyTrend = "–";
  if (sessions.length > 1) {
    const previousAccuracy = sessions[sessions.length - 2].accuracy;
    if (averageAccuracy > previousAccuracy) {
      accuracyTrend = "↑";
    } else if (averageAccuracy < previousAccuracy) {
      accuracyTrend = "↓";
    }
  }

  return {
    totalSessions,
    totalShots,
    totalScored,
    averageAccuracy,
    highestAccuracy,
    mostGoalsInSession,
    streakDays,
    accuracyTrend
  };
};

// Get achievements based on stats
export const getAchievements = (stats: SessionStats): Achievement[] => {
  return [
    {
      id: 'streak',
      name: '3-Day Streak',
      icon: 'fire',
      unlocked: stats.streakDays >= 3,
      description: 'Practice 3 days in a row'
    },
    {
      id: 'accuracy',
      name: '90% Club',
      icon: 'bullseye',
      unlocked: stats.highestAccuracy >= 90,
      description: 'Achieve 90% accuracy in a session'
    },
    {
      id: 'volume',
      name: '100 Shots',
      icon: 'award',
      unlocked: stats.totalShots >= 100,
      description: 'Complete 100 total shots'
    },
    {
      id: 'dedication',
      name: 'Dedicated',
      icon: 'trophy',
      unlocked: stats.totalSessions >= 10,
      description: 'Complete 10 sessions'
    }
  ];
};

// Create and send session to server
export const createSession = async (session: InsertSession): Promise<Session> => {
  try {
    const response = await apiRequest('POST', '/api/sessions', session);
    const newSession: Session = await response.json();

    // Backup to local storage
    const localSessions = getSessionsFromLocalStorage();
    saveSessionsToLocalStorage([...localSessions, newSession]);

    return newSession;
  } catch (error) {
    console.error("Failed to create session on server, saving locally", error);
    // Fallback to local storage if server request fails
    const localSessions = getSessionsFromLocalStorage();
    const newSession: Session = {
      ...session,
      id: Date.now(), // Use timestamp as ID for local storage
      createdAt: new Date()
    };
    saveSessionsToLocalStorage([...localSessions, newSession]);
    return newSession;
  }
};

// Share session via WhatsApp
export const shareViaWhatsApp = (session: Session): void => {
  const message = `Check out my netball shooting stats for "${session.name || 'Shooting Practice'}": ${session.scoredShots}/${session.totalShots} shots (${session.accuracy}% accuracy)${session.coachComment ? `\n\nCoach's feedback: ${session.coachComment}` : ''}`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
};

// Share session via Email
export const shareViaEmail = (session: Session): void => {
  const subject = `Netball Shooting Stats: ${session.name || 'Shooting Practice'}`;
  const body = `My shooting stats for "${session.name || 'Shooting Practice'}":\n\nTotal Shots: ${session.totalShots}\nGoals: ${session.scoredShots}\nMisses: ${session.missedShots}\nAccuracy: ${session.accuracy}%${session.coachComment ? `\n\nCoach's feedback: ${session.coachComment}` : ''}`;

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  window.open(`mailto:?subject=${encodedSubject}&body=${encodedBody}`, '_blank');
};
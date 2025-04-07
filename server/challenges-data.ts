
import type { InsertChallenge } from "@shared/schema";
export const presetChallenges: Omit<InsertChallenge, "startDate" | "endDate">[] = [
  {
    title: "Perfect Ten",
    description: "Score 10 consecutive shots without missing",
    difficulty: "hard",
    goalCount: 10,
    goalAccuracy: 100,
    isActive: false
  },
  {
    title: "Volume Shooter",
    description: "Complete 50 shots with at least 70% accuracy",
    difficulty: "medium",
    goalCount: 50,
    goalAccuracy: 70,
    isActive: false
  },
  {
    title: "Quick Fire",
    description: "Make 20 shots in under 2 minutes with 80% accuracy",
    difficulty: "hard",
    goalCount: 20,
    goalAccuracy: 80,
    isActive: false
  },
  {
    title: "Precision Master",
    description: "Complete 30 shots with 90% accuracy",
    difficulty: "hard",
    goalCount: 30,
    goalAccuracy: 90,
    isActive: false
  },
  {
    title: "Beginner's Challenge",
    description: "Complete 15 shots with at least 60% accuracy",
    difficulty: "easy",
    goalCount: 15,
    goalAccuracy: 60,
    isActive: false
  },
  {
    title: "Marathon",
    description: "Complete 100 shots in a single session",
    difficulty: "medium",
    goalCount: 100,
    goalAccuracy: 50,
    isActive: false
  },
  {
    title: "Sharpshooter",
    description: "Make 25 shots with 85% accuracy",
    difficulty: "medium",
    goalCount: 25,
    goalAccuracy: 85,
    isActive: false
  },
  {
    title: "First Steps",
    description: "Complete 10 shots with any accuracy",
    difficulty: "easy",
    goalCount: 10,
    goalAccuracy: 30,
    isActive: false
  },
  {
    title: "Rising Star",
    description: "Complete 20 shots with 75% accuracy",
    difficulty: "medium",
    goalCount: 20,
    goalAccuracy: 75,
    isActive: false
  },
  {
    title: "Elite Scorer",
    description: "Make 40 shots with 95% accuracy",
    difficulty: "hard",
    goalCount: 40,
    goalAccuracy: 95,
    isActive: false
  },
  {
    title: "Endurance Test",
    description: "Complete 75 shots with 65% accuracy",
    difficulty: "medium",
    goalCount: 75,
    goalAccuracy: 65,
    isActive: false
  },
  {
    title: "Quick Success",
    description: "Make 5 consecutive shots",
    difficulty: "easy",
    goalCount: 5,
    goalAccuracy: 100,
    isActive: false
  },
  {
    title: "Steady Progress",
    description: "Complete 35 shots with 80% accuracy",
    difficulty: "medium",
    goalCount: 35,
    goalAccuracy: 80,
    isActive: false
  },
  {
    title: "Accuracy Focus",
    description: "Make 15 shots with 90% accuracy",
    difficulty: "hard",
    goalCount: 15,
    goalAccuracy: 90,
    isActive: false
  },
  {
    title: "Practice Makes Perfect",
    description: "Complete 60 shots with 70% accuracy",
    difficulty: "medium",
    goalCount: 60,
    goalAccuracy: 70,
    isActive: false
  },
  {
    title: "Starting Strong",
    description: "Make 8 shots with 75% accuracy",
    difficulty: "easy",
    goalCount: 8,
    goalAccuracy: 75,
    isActive: false
  },
  {
    title: "Power Hour",
    description: "Complete 45 shots with 85% accuracy",
    difficulty: "hard",
    goalCount: 45,
    goalAccuracy: 85,
    isActive: false
  },
  {
    title: "consistency Check",
    description: "Make 25 shots with 80% accuracy",
    difficulty: "medium",
    goalCount: 25,
    goalAccuracy: 80,
    isActive: false
  },
  {
    title: "Beginner Boost",
    description: "Complete 12 shots with 65% accuracy",
    difficulty: "easy",
    goalCount: 12,
    goalAccuracy: 65,
    isActive: false
  },
  {
    title: "Pro Status",
    description: "Make 50 shots with 95% accuracy",
    difficulty: "hard",
    goalCount: 50,
    goalAccuracy: 95,
    isActive: false
  }
];

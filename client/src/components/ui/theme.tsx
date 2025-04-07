import * as React from "react";

// Define the color palette (as per the design reference)
const colors = {
  primary: "#1E5CB3",
  secondary: "#FF5757",
  accent: "#42C86A",
  warning: "#FFD166",
  light: "#F8F9FA",
  dark: "#212529",
};

// Function to determine color based on accuracy
export const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 85) return colors.accent;
  if (accuracy >= 70) return colors.primary;
  return colors.warning;
};

// Function to determine border color for session cards
export const getSessionBorderColor = (accuracy: number): string => {
  if (accuracy >= 85) return "border-l-4 border-accent";
  if (accuracy >= 70) return "border-l-4 border-primary";
  return "border-l-4 border-warning";
};

// Function to generate achievement color 
export const getAchievementColor = (unlocked: boolean): string => {
  return unlocked ? "bg-accent" : "bg-gray-300";
};

export { colors };

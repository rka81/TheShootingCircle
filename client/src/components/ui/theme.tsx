import * as React from "react";

// Define the Brentwood Netball Club color palette
const colors = {
  primary: "#0c2576", // Brentwood blue
  secondary: "#feef33", // Brentwood yellow
  accent: "#265cb5", // Lighter blue
  warning: "#feef33", // Same as secondary
  light: "#F8F9FA",
  dark: "#212529",
};

// Function to determine color based on accuracy
export const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 85) return colors.primary;
  if (accuracy >= 70) return colors.accent;
  return colors.secondary;
};

// Function to determine border color for session cards
export const getSessionBorderColor = (accuracy: number): string => {
  if (accuracy >= 85) return "border-l-4 border-[#0c2576]";
  if (accuracy >= 70) return "border-l-4 border-[#265cb5]";
  return "border-l-4 border-[#feef33]";
};

// Function to generate achievement color 
export const getAchievementColor = (unlocked: boolean): string => {
  return unlocked ? "bg-[#0c2576] text-[#feef33]" : "bg-gray-300";
};

export { colors };

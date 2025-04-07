import React from "react";
import { Achievement } from "@/lib/types";
import { getAchievementColor } from "../ui/theme";

interface AchievementBadgeProps {
  achievement: Achievement;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const badgeColor = getAchievementColor(achievement.unlocked);
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-12 h-12 rounded-full ${achievement.unlocked ? 'bg-accent' : 'bg-gray-300'} flex items-center justify-center text-white mb-1`}
      >
        <i className={`fas fa-${achievement.icon}`}></i>
      </div>
      <span className="text-xs text-center">
        {achievement.unlocked ? achievement.name : "Locked"}
      </span>
    </div>
  );
};

interface AchievementGridProps {
  achievements: Achievement[];
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-primary">Your Achievements</h2>
        <span className="text-xs text-gray-500">{unlockedCount}/{achievements.length} Earned</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
};

export default AchievementGrid;

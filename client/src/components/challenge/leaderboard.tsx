
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../ui/card";
import type { ChallengeAttempt } from "@shared/schema";

export const Leaderboard: React.FC<{ challengeId: number }> = ({ challengeId }) => {
  const { data: attempts } = useQuery<ChallengeAttempt[]>({
    queryKey: ['/api/challenge-attempts', challengeId],
  });

  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold text-brentwood-blue mb-4">Leaderboard</h3>
      <div className="space-y-2">
        {attempts?.map((attempt, index) => (
          <div 
            key={attempt.id} 
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold">{index + 1}</span>
              <span>Player {attempt.id}</span>
            </div>
            <div className="text-sm font-medium">
              {attempt.completed ? "Completed" : "In Progress"}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};


import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import type { Challenge } from "@shared/schema";

export const WeeklyChallenge: React.FC = () => {
  const { data: activeChallenge } = useQuery<Challenge>({
    queryKey: ['/api/challenges/active'],
  });

  if (!activeChallenge) {
    return null;
  }

  const daysLeft = Math.ceil((new Date(activeChallenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-bold text-brentwood-blue mb-2">Weekly Challenge</h3>
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold">{activeChallenge.title}</h4>
          <p className="text-sm text-gray-600">{activeChallenge.description}</p>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Goal: {activeChallenge.goalCount} shots</span>
            <span>{daysLeft} days left</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Difficulty: {activeChallenge.difficulty}
          </span>
          <Button variant="outline" size="sm">View Leaderboard</Button>
        </div>
      </div>
    </Card>
  );
};

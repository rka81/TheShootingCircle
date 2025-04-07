import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import type { Challenge, ChallengeAttempt } from "@shared/schema";

export interface WeeklyChallengeProps {
  onNavigate: (page: NavPage) => void;
}

export const WeeklyChallenge: React.FC<WeeklyChallengeProps> = ({ onNavigate }) => {
  const { data: activeChallenge, isLoading: challengeLoading } = useQuery<Challenge>({
    queryKey: ['/api/challenges/active'],
  });

  const { data: attempts } = useQuery<ChallengeAttempt[]>({
    queryKey: ['/api/challenge-attempts', activeChallenge?.id],
    enabled: !!activeChallenge,
  });

  if (challengeLoading) {
    return (
      <Card className="p-4 mb-6 animate-pulse">
        <h3 className="text-lg font-bold text-brentwood-blue mb-2">Loading...</h3>
      </Card>
    );
  }

  if (!activeChallenge) {
    return null;
  }

  // Calculate days remaining
  const daysLeft = Math.ceil(
    (new Date(activeChallenge.endDate).getTime() - new Date().getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  // Get latest attempt
  const latestAttempt = attempts?.[0];

  // Simple pass/fail based on accuracy comparison
  console.log('Latest Attempt:', latestAttempt);
  console.log('Active Challenge:', activeChallenge);
  
  const attemptAccuracy = latestAttempt?.sessionAccuracy ?? 0;
  const goalAccuracy = activeChallenge.goalAccuracy;
  
  console.log('Attempt Accuracy:', attemptAccuracy);
  console.log('Goal Accuracy:', goalAccuracy);
  
  const isCompleted = latestAttempt ? attemptAccuracy >= goalAccuracy : false;

  // Calculate progress for progress bar
  const progress = isCompleted ? 100 : 0;

  // Apply styles based on completion
  const buttonStyles = isCompleted 
    ? "bg-green-500 text-white hover:bg-green-600" 
    : "hover:bg-brentwood-blue hover:text-white";

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
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Required Accuracy: {activeChallenge.goalAccuracy}%
          </span>
          <Button 
            variant={isCompleted ? "default" : "outline"}
            size="sm" 
            className={buttonStyles}
            onClick={() => onNavigate("newSession")}
          >
            {isCompleted ? "Completed!" : "Take Challenge"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
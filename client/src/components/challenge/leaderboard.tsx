
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../ui/card";
import type { Challenge, ChallengeAttempt } from "@shared/schema";
import { format } from "date-fns";

export const Leaderboard: React.FC<{ challengeId?: number }> = ({ challengeId }) => {
  const { data: challenges } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });

  const { data: attempts } = useQuery<ChallengeAttempt[]>({
    queryKey: ['/api/challenge-attempts'],
  });

  if (!challenges) return null;

  return (
    <div className="space-y-6">
      {challenges.map((challenge) => {
        const challengeAttempts = attempts?.filter(a => a.challengeId === challenge.id) || [];
        const isActive = new Date(challenge.endDate) > new Date();
        
        return (
          <Card key={challenge.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-brentwood-blue">
                  {challenge.title}
                  {isActive && <span className="ml-2 text-green-500 text-sm">(Active)</span>}
                </h3>
                <p className="text-sm text-gray-600">{challenge.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(challenge.startDate), 'MMM d')} - {format(new Date(challenge.endDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  Goal: {challenge.goalCount} shots at {challenge.goalAccuracy}% accuracy
                </div>
                <div className="text-xs text-gray-500">
                  {challengeAttempts.length} attempts
                </div>
              </div>
            </div>

            {challengeAttempts.length > 0 && (
              <div className="space-y-2">
                {challengeAttempts.map((attempt) => (
                  <div 
                    key={attempt.id} 
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span>Session #{attempt.sessionId}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">
                        Accuracy: {attempt.accuracy}%
                      </span>
                      <span className={`text-sm font-medium ${attempt.completed ? 'text-green-500' : 'text-orange-500'}`}>
                        {attempt.completed ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

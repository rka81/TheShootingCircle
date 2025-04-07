
import React from "react";
import { Leaderboard as LeaderboardComponent } from "@/components/challenge/leaderboard";
import { useQuery } from "@tanstack/react-query";
import type { Challenge } from "@shared/schema";

export default function LeaderboardPage() {
  const { data: activeChallenge } = useQuery<Challenge>({
    queryKey: ['/api/challenges/active'],
  });

  return (
    <div className="container mx-auto px-4 pt-4 pb-20">
      <h1 className="text-2xl font-bold text-brentwood-blue mb-4">Challenge Leaderboard</h1>
      {activeChallenge && <LeaderboardComponent challengeId={activeChallenge.id} />}
    </div>
  );
}

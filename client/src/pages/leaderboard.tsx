
import React from "react";
import { Leaderboard as LeaderboardComponent } from "@/components/challenge/leaderboard";
import { useQuery } from "@tanstack/react-query";
import type { Challenge } from "@shared/schema";

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 pt-4 pb-20">
      <h1 className="text-2xl font-bold text-brentwood-blue mb-4">Shooting Challenges</h1>
      <LeaderboardComponent />
    </div>
  );
}

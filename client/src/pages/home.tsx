import React from "react";
import { useQuery } from "@tanstack/react-query";
import { type Session } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileBanner } from "@/components/navigation/header";
import SessionCard from "@/components/session/session-card";
import { WeeklyProgressChart } from "@/components/stats/stats-chart";
import { AchievementGrid } from "@/components/stats/achievement-badge";
import { WeeklyChallenge } from "@/components/challenge/weekly-challenge";
import { 
  calculateStats, 
  getAchievements, 
  getSessionsFromLocalStorage,
  saveSessionsToLocalStorage
} from "@/lib/storage";
import { SessionStats, ProfileData, NavPage } from "@/lib/types";

interface HomePageProps {
  onNavigate: (page: NavPage) => void;
  profileData: ProfileData | null;
  showProfile: boolean;
}



const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  profileData,
  showProfile
}) => {
  const { data: sessions, isLoading, error } = useQuery<Session[]>({
    queryKey: ['/api/sessions'],
    onSuccess: (data) => {
      // Back up to local storage
      saveSessionsToLocalStorage(data);
    },
    onError: () => {
      // If API fails, use local storage
      return getSessionsFromLocalStorage();
    }
  });

  const stats: SessionStats = React.useMemo(() => {
    return calculateStats(sessions || []);
  }, [sessions]);

  const achievements = React.useMemo(() => {
    return getAchievements(stats);
  }, [stats]);

  // Get most recent sessions (up to 3)
  const recentSessions = React.useMemo(() => {
    return sessions ? [...sessions].slice(0, 3) : [];
  }, [sessions]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 pb-20">
        <ProfileBanner profileData={profileData} visible={showProfile} />
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-bold mb-3 text-brentwood-blue">Your Shooting Stats</h2>
          <div className="flex justify-between gap-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-40 w-full mb-6" />
        <Skeleton className="h-48 w-full mb-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 pb-20">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 text-center">
          <h2 className="text-lg font-bold mb-3 text-brentwood-blue">Error Loading Data</h2>
          <p className="text-gray-700 mb-3">There was a problem loading your data.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-brentwood-blue text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      {/* Profile Banner */}
      <ProfileBanner profileData={profileData} visible={showProfile} />

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-bold mb-3 text-brentwood-blue">Your Shooting Stats</h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-gray-50">
            <div className="text-2xl font-bold text-dark">{stats.averageAccuracy}%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
          <div className="p-2 rounded-lg bg-gray-50">
            <div className="text-2xl font-bold text-dark">{stats.totalShots}</div>
            <div className="text-xs text-gray-500">Total Shots</div>
          </div>
          <div className="p-2 rounded-lg bg-gray-50">
            <div className="text-2xl font-bold text-dark">{stats.totalSessions}</div>
            <div className="text-xs text-gray-500">Sessions</div>
          </div>
        </div>
      </div>

      {/* New Session Button */}
      <Button 
        onClick={() => onNavigate("newSession")}
        className="w-full bg-brentwood-blue hover:bg-brentwood-blue/90 text-white font-bold py-4 px-4 rounded-lg shadow-md mb-6 flex items-center justify-center transition-colors h-14"
      >
        <i className="fas fa-plus-circle mr-2"></i>
        New Shooting Session
      </Button>

      {/* Recent Sessions */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-brentwood-blue">Recent Sessions</h2>
          <button 
            onClick={() => onNavigate("history")}
            className="text-sm text-brentwood-blue font-medium"
          >
            View All
          </button>
        </div>

        {recentSessions.length > 0 ? (
          recentSessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-gray-500">No sessions recorded yet</p>
          </div>
        )}
      </div>

      {/* Weekly Progress */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-bold mb-3 text-brentwood-blue">Weekly Progress</h2>
        <WeeklyProgressChart sessions={sessions || []} />
      </div>

      <AchievementGrid achievements={achievements} />
      <WeeklyChallenge />
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        {/* Leaderboard would go here */}
      </div>
    </div>
  );
};

export default HomePage;
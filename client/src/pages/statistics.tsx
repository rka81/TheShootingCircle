import React from "react";
import { useQuery } from "@tanstack/react-query";
import { type Session } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AccuracyTrendChart, MonthlyChart } from "@/components/stats/stats-chart";
import { calculateStats, getSessionsFromLocalStorage, saveSessionsToLocalStorage } from "@/lib/storage";
import { NavPage } from "@/lib/types";

interface StatisticsPageProps {
  onNavigate: (page: NavPage) => void;
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ onNavigate }) => {
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

  const stats = React.useMemo(() => {
    return calculateStats(sessions || []);
  }, [sessions]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 pb-20">
        <h2 className="text-xl font-bold text-brentwood-blue mb-4">My Statistics</h2>
        <Skeleton className="h-56 w-full mb-6" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-56 w-full mb-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 pb-20">
        <h2 className="text-xl font-bold text-brentwood-blue mb-4">My Statistics</h2>
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 text-center">
          <p className="text-gray-700 mb-3">There was a problem loading your statistics.</p>
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
      <div className="mb-6">
        <h2 className="text-xl font-bold text-brentwood-blue mb-4">My Statistics</h2>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-bold mb-3 text-brentwood-blue">Shooting Accuracy Trend</h3>
          <AccuracyTrendChart sessions={sessions || []} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-md font-bold mb-2 text-brentwood-blue">Personal Bests</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-sm text-gray-600">Highest Accuracy:</span>
                <span className="font-bold">{stats.highestAccuracy}%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-gray-600">Most Goals (Session):</span>
                <span className="font-bold">{stats.mostGoalsInSession}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-gray-600">Longest Streak:</span>
                <span className="font-bold">{stats.streakDays} days</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-md font-bold mb-2 text-brentwood-blue">Overall Stats</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-sm text-gray-600">Total Sessions:</span>
                <span className="font-bold">{stats.totalSessions}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-gray-600">Total Shots:</span>
                <span className="font-bold">{stats.totalShots}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-gray-600">Avg. Accuracy:</span>
                <span className="font-bold">{stats.averageAccuracy}%</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-bold mb-3 text-brentwood-blue">Monthly Progress</h3>
          <MonthlyChart sessions={sessions || []} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Session } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SessionCard from "@/components/session/session-card";
import { getSessionsFromLocalStorage, saveSessionsToLocalStorage } from "@/lib/storage";
import { TimeFilter, NavPage } from "@/lib/types";
// We'll use our own date utility functions

interface HistoryPageProps {
  onNavigate: (page: NavPage) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<TimeFilter>("all");

  const { data: sessions, isLoading, error } = useQuery<Session[]>({
    queryKey: ['/api/sessions'],
    gcTime: 5 * 60 * 1000,
    staleTime: 1 * 60 * 1000
  });
  
  // Backup to local storage when data is fetched
  React.useEffect(() => {
    if (sessions) {
      saveSessionsToLocalStorage(sessions);
    }
  }, [sessions]);
  
  // Use local storage as fallback if API fails
  React.useEffect(() => {
    if (error) {
      console.error("Failed to load sessions from API, using local storage");
      const localSessions = getSessionsFromLocalStorage();
      if (localSessions.length > 0) {
        console.log("Loaded sessions from local storage:", localSessions.length);
      }
    }
  }, [error]);

  // Helper functions for date filtering
  const isWithinLastWeek = (date: Date, now: Date): boolean => {
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    return date >= oneWeekAgo && date <= now;
  };

  const isWithinLastMonth = (date: Date, now: Date): boolean => {
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    return date >= oneMonthAgo && date <= now;
  };

  const filteredSessions = React.useMemo(() => {
    if (!sessions) return [];
    
    const now = new Date();
    const sessionsArray = [...sessions];
    
    switch (filter) {
      case 'week':
        return sessionsArray.filter((session: Session) => isWithinLastWeek(new Date(session.createdAt), now));
      case 'month':
        return sessionsArray.filter((session: Session) => isWithinLastMonth(new Date(session.createdAt), now));
      case 'high':
        return sessionsArray.sort((a: Session, b: Session) => b.accuracy - a.accuracy);
      default:
        return sessionsArray;
    }
  }, [sessions, filter]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 pb-20">
        <h2 className="text-xl font-bold text-primary mb-4">Session History</h2>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-20" />
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-28 w-full mb-3" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 pb-20">
        <h2 className="text-xl font-bold text-primary mb-4">Session History</h2>
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 text-center">
          <p className="text-gray-700 mb-3">There was a problem loading your history.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white"
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
        <h2 className="text-xl font-bold text-primary mb-4">Session History</h2>
        
        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-4">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as TimeFilter)}
          >
            <SelectTrigger className="bg-white border border-gray-300 rounded-lg w-40">
              <SelectValue placeholder="Filter sessions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="high">Highest Accuracy</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={() => onNavigate("home")}
            variant="ghost"
            className="text-primary font-medium flex items-center"
          >
            <i className="fas fa-arrow-left mr-1"></i> Back
          </Button>
        </div>
        
        {/* Session List */}
        <div className="space-y-3">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session: Session) => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <p className="text-gray-500">No sessions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

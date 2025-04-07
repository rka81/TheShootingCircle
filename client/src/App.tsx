import React, { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/navigation/header";
import BottomNav from "@/components/navigation/bottom-nav";
import HomePage from "@/pages/home";
import NewSessionPage from "@/pages/new-session";
import HistoryPage from "@/pages/history";
import StatisticsPage from "@/pages/statistics";
import { NavPage, ProfileData } from "@/lib/types";
import { getProfileFromLocalStorage } from "@/lib/storage";

function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>("home");
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // Load profile data on mount
  useEffect(() => {
    const storedProfile = getProfileFromLocalStorage();
    if (storedProfile) {
      setProfileData(storedProfile);
    }
  }, []);

  // Handle page navigation
  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page);
    // Hide profile banner when navigating
    setShowProfile(false);
  };

  // Toggle profile visibility
  const toggleProfile = () => {
    setShowProfile(prev => !prev);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen">
        <Header 
          profileData={profileData}
          showProfile={showProfile}
          toggleProfile={toggleProfile}
        />

        <main className="flex-grow overflow-y-auto" id="mainContent">
          {currentPage === "home" && (
            <HomePage 
              onNavigate={handleNavigate} 
              profileData={profileData}
              showProfile={showProfile}
            />
          )}
          {currentPage === "newSession" && (
            <NewSessionPage onNavigate={handleNavigate} />
          )}
          {currentPage === "history" && (
            <HistoryPage onNavigate={handleNavigate} />
          )}
          {currentPage === "stats" && (
            <StatisticsPage onNavigate={handleNavigate} />
          )}
        </main>

        <BottomNav 
          currentPage={currentPage} 
          onPageChange={handleNavigate} 
        />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

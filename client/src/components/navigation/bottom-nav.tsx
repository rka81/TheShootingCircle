import React from "react";
import { NavPage } from "@/lib/types";

interface BottomNavProps {
  currentPage: NavPage;
  onPageChange: (page: NavPage) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onPageChange }) => {
  const navItems: Array<{ id: NavPage; label: string; icon: string }> = [
    { id: "home", label: "Home", icon: "fa-home" },
    { id: "newSession", label: "New", icon: "fa-plus-circle" },
    { id: "history", label: "History", icon: "fa-history" },
    { id: "stats", label: "Stats", icon: "fa-chart-line" },
    { id: "leaderboard", label: "Leaders", icon: "fa-trophy" },
  ];

  const activeColor = '#0c2576'; // Brentwood Blue

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-t-lg ${
                isActive ? "font-semibold" : "text-gray-500"
              }`}
              style={{
                color: isActive ? activeColor : undefined
              }}
            >
              <i className={`fas ${item.icon} text-xl`}></i>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

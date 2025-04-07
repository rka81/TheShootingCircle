import React from "react";
import { ProfileData } from "@/lib/types";

interface HeaderProps {
  profileData: ProfileData | null;
  showProfile: boolean;
  toggleProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ profileData, showProfile, toggleProfile }) => {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center">
          <i className="fas fa-basketball text-warning mr-2"></i>
          Netball Shooter
        </h1>
        <button 
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition" 
          aria-label="Profile"
          onClick={toggleProfile}
        >
          <i className="fas fa-user text-white"></i>
        </button>
      </div>
    </header>
  );
};

export const ProfileBanner: React.FC<{ profileData: ProfileData | null, visible: boolean }> = ({ 
  profileData, 
  visible 
}) => {
  if (!visible || !profileData) return null;

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4 border-l-4 border-primary">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl mr-3">
          <span>{profileData.initials}</span>
        </div>
        <div>
          <h3 className="font-semibold text-dark">{profileData.name}</h3>
          {profileData.team && <p className="text-sm text-gray-500">{profileData.team}</p>}
        </div>
      </div>
    </div>
  );
};

export default Header;

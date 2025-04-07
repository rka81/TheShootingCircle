import React from "react";
import { ProfileData } from "@/lib/types";
import brentwoodLogo from "@assets/BNC-Badge.png";

interface HeaderProps {
  profileData: ProfileData | null;
  showProfile: boolean;
  toggleProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ profileData, showProfile, toggleProfile }) => {
  return (
    <header style={{ backgroundColor: '#0c2576' }} className="text-white p-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center">
          <img 
            src={brentwoodLogo} 
            alt="Brentwood Netball Club" 
            className="h-10 mr-3" 
          />
          <span className="hidden sm:inline">The Shooting Circle</span>
          <span className="inline sm:hidden">Shooting Circle</span>
        </h1>
        <button 
          className="p-2 rounded-full hover:bg-white/30 transition" 
          aria-label="Profile"
          onClick={toggleProfile}
          style={{ backgroundColor: 'rgba(254, 239, 51, 0.2)' }}
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
    <div className="mb-6 bg-white rounded-lg shadow-md p-4" style={{ borderLeft: '4px solid #0c2576' }}>
      <div className="flex items-center">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mr-3"
          style={{ backgroundColor: '#0c2576', color: '#feef33' }}
        >
          <span>{profileData.initials}</span>
        </div>
        <div>
          <h3 className="font-semibold text-dark">{profileData.name}</h3>
          {profileData.team && <p className="text-sm" style={{ color: '#0c2576' }}>{profileData.team}</p>}
        </div>
      </div>
    </div>
  );
};

export default Header;

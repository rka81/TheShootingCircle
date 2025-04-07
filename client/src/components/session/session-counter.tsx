import React from "react";

interface SessionCounterProps {
  totalShots: number;
  scoredShots: number;
  missedShots: number;
  accuracy: number;
}

export const SessionCounter: React.FC<SessionCounterProps> = ({
  totalShots,
  scoredShots,
  missedShots,
  accuracy
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-gray-100 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-black mb-1">{totalShots}</div>
        <div className="text-xs text-gray-600">Total Shots</div>
      </div>
      <div style={{ backgroundColor: 'rgba(12, 37, 118, 0.1)' }} className="p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-black mb-1">{scoredShots}</div>
        <div className="text-xs text-gray-600">Goals</div>
      </div>
      <div style={{ backgroundColor: 'rgba(254, 239, 51, 0.2)' }} className="p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-black mb-1">{missedShots}</div>
        <div className="text-xs text-gray-600">Misses</div>
      </div>
    </div>
  );
};

export const AccuracyBar: React.FC<{ accuracy: number }> = ({ accuracy }) => {
  return (
    <div className="mb-6">
      <div className="w-full bg-gray-200 rounded-full h-5">
        <div 
          className="h-5 rounded-full text-xs text-white text-center flex items-center justify-center"
          style={{ 
            width: `${accuracy}%`,
            backgroundColor: '#0c2576',
            border: '1px solid #feef33'
          }}
        >
          <span className="font-bold">{accuracy}%</span>
        </div>
      </div>
      <div className="text-center mt-1 text-sm" style={{ color: '#0c2576' }}>Shooting Accuracy</div>
    </div>
  );
};

export default SessionCounter;

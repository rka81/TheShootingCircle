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
        <div className="text-2xl font-bold mb-1">{totalShots}</div>
        <div className="text-xs text-gray-600">Total Shots</div>
      </div>
      <div className="bg-accent bg-opacity-10 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-accent mb-1">{scoredShots}</div>
        <div className="text-xs text-gray-600">Goals</div>
      </div>
      <div className="bg-secondary bg-opacity-10 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-secondary mb-1">{missedShots}</div>
        <div className="text-xs text-gray-600">Misses</div>
      </div>
    </div>
  );
};

export const AccuracyBar: React.FC<{ accuracy: number }> = ({ accuracy }) => {
  return (
    <div className="mb-6">
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className="bg-primary h-4 rounded-full text-xs text-white text-center"
          style={{ width: `${accuracy}%` }}
        >
          <span>{accuracy}%</span>
        </div>
      </div>
      <div className="text-center mt-1 text-sm text-gray-600">Shooting Accuracy</div>
    </div>
  );
};

export default SessionCounter;

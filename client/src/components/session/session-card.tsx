import React from "react";
import { format } from "date-fns";
import { type Session } from "@shared/schema";
import { getSessionBorderColor } from "../ui/theme";
import { shareViaWhatsApp, shareViaEmail } from "@/lib/storage";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface SessionCardProps {
  session: Session;
  showActions?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ 
  session,
  showActions = true
}) => {
  const formattedDate = format(new Date(session.createdAt), "MMM d, yyyy - h:mm a");
  const borderColorClass = getSessionBorderColor(session.accuracy);
  
  const handleShare = (method: 'whatsapp' | 'email') => {
    if (method === 'whatsapp') {
      shareViaWhatsApp(session);
    } else {
      shareViaEmail(session);
    }
  };

  return (
    <Card className={`bg-white rounded-lg shadow-sm mb-3 p-4 ${borderColorClass}`}>
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{session.name || "Shooting Practice"}</h3>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold" style={{ color: getAccuracyColor(session.accuracy) }}>
              {session.accuracy}%
            </div>
            <div className="text-xs text-gray-500">
              {session.scoredShots}/{session.totalShots} shots
            </div>
          </div>
        </div>
        
        {(session.coachComment || showActions) && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <div className="text-xs text-gray-500">
                {session.coachComment ? (
                  <>
                    <i className="fas fa-comment-alt text-primary mr-1"></i>
                    Coach: {session.coachComment}
                  </>
                ) : (
                  <>
                    <i className="fas fa-comment-alt text-primary mr-1"></i>
                    No comments
                  </>
                )}
              </div>
              
              {showActions && (
                <div className="flex space-x-2">
                  <button 
                    className="text-gray-400 hover:text-primary"
                    onClick={() => handleShare('whatsapp')}
                  >
                    <i className="fas fa-share-alt"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 85) return "#42C86A"; // accent
  if (accuracy >= 70) return "#1E5CB3"; // primary
  return "#FFD166"; // warning
}

export default SessionCard;

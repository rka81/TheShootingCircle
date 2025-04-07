import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertSession } from "@shared/schema";
import SessionForm from "@/components/session/session-form";
import { createSession } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { NavPage } from "@/lib/types";

interface NewSessionPageProps {
  onNavigate: (page: NavPage) => void;
}

const NewSessionPage: React.FC<NewSessionPageProps> = ({ onNavigate }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (newSession: InsertSession) => createSession(newSession),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      toast({
        title: "Session saved",
        description: "Your shooting session has been recorded!",
        variant: "default",
      });
      onNavigate("home");
    },
    onError: (error) => {
      console.error("Failed to save session:", error);
      toast({
        title: "Failed to save session",
        description: "An error occurred while saving your session. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSaveSession = async (session: InsertSession) => {
    mutation.mutate(session);
  };

  return (
    <div className="container mx-auto p-4 pb-20">
      <SessionForm 
        onSessionSave={handleSaveSession}
        onClose={() => onNavigate("home")} 
      />
    </div>
  );
};

export default NewSessionPage;

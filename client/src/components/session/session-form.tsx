import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type InsertSession } from "@shared/schema";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SessionCounter, AccuracyBar } from "./session-counter";
import { shareViaWhatsApp, shareViaEmail } from "@/lib/storage";

// Create a form validation schema
const sessionFormSchema = z.object({
  name: z.string().optional(),
  totalShots: z.number().min(0),
  scoredShots: z.number().min(0),
  missedShots: z.number().min(0),
  accuracy: z.number().min(0).max(100),
  playerName: z.string().optional(),
  coachComment: z.string().optional(),
  drill: z.string().optional(),
});

type SessionFormValues = z.infer<typeof sessionFormSchema>;

interface SessionFormProps {
  onSessionSave: (session: InsertSession) => void;
  onClose: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({ onSessionSave, onClose }) => {
  const [totalShots, setTotalShots] = useState(0);
  const [scoredShots, setScoredShots] = useState(0);
  const [missedShots, setMissedShots] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isPending, setIsPending] = useState(false);

  // Define preset drills
  const presetDrills = [
    { id: "10-each-post", name: "10 from each post corner" },
    { id: "center-circle", name: "Center circle (20 shots)" },
    { id: "moving-shots", name: "Moving shots across circle" },
    { id: "pressure-drill", name: "Pressure shooting (with timer)" },
    { id: "baseline-shots", name: "Baseline shots (10 left, 10 right)" }
  ];

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      name: "",
      totalShots: 0,
      scoredShots: 0,
      missedShots: 0,
      accuracy: 0,
      playerName: "",
      coachComment: "",
      drill: ""
    }
  });

  const updateStats = (scored: boolean) => {
    const newTotalShots = totalShots + 1;
    const newScoredShots = scored ? scoredShots + 1 : scoredShots;
    const newMissedShots = scored ? missedShots : missedShots + 1;
    const newAccuracy = Math.round((newScoredShots / newTotalShots) * 100);

    setTotalShots(newTotalShots);
    setScoredShots(newScoredShots);
    setMissedShots(newMissedShots);
    setAccuracy(newAccuracy);

    // Update form values
    form.setValue("totalShots", newTotalShots);
    form.setValue("scoredShots", newScoredShots);
    form.setValue("missedShots", newMissedShots);
    form.setValue("accuracy", newAccuracy);
  };

  const onGoal = () => updateStats(true);
  const onMiss = () => updateStats(false);

  const onSubmit = async (data: SessionFormValues) => {
    if (totalShots === 0) {
      alert("You need to record at least one shot!");
      return;
    }

    setIsPending(true);
    try {
      // Convert undefined to null for database compatibility
      const sessionData: InsertSession = {
        name: data.name || null,
        totalShots: data.totalShots,
        scoredShots: data.scoredShots,
        missedShots: data.missedShots,
        accuracy: data.accuracy,
        playerName: data.playerName || null,
        coachComment: data.coachComment || null
      };
      
      await onSessionSave(sessionData);
      // Reset form
      form.reset();
      setTotalShots(0);
      setScoredShots(0);
      setMissedShots(0);
      setAccuracy(0);
    } catch (error) {
      console.error("Error saving session:", error);
    } finally {
      setIsPending(false);
    }
  };

  const shareSession = async (method: 'whatsapp' | 'email') => {
    if (totalShots === 0) {
      alert("You need to record at least one shot to share!");
      return;
    }

    const sessionData = {
      id: Date.now(),
      name: form.getValues("name") || "Shooting Practice",
      totalShots,
      scoredShots,
      missedShots,
      accuracy,
      playerName: form.getValues("playerName") || null,
      coachComment: form.getValues("coachComment") || null,
      createdAt: new Date()
    };

    if (method === 'whatsapp') {
      shareViaWhatsApp(sessionData);
    } else {
      shareViaEmail(sessionData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-brentwood-blue">
          The Shooting Circle
          <span className="block text-sm text-gray-600 font-normal mt-1">New Practice Session</span>
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-sm font-bold text-brentwood-blue mb-1">Session Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g. After School Practice"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Preset Drills */}
          <FormField
            control={form.control}
            name="drill"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-sm font-bold text-brentwood-blue mb-1">Training Drill (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg">
                      <SelectValue placeholder="Select a preset training drill" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="custom">Choose a drill</SelectItem>
                    {presetDrills.map((drill) => (
                      <SelectItem key={drill.id} value={drill.id}>
                        {drill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-500 mt-1">
                  Select a preset drill or create your own custom session
                </div>
              </FormItem>
            )}
          />
          
          {/* Counter Displays */}
          <SessionCounter
            totalShots={totalShots}
            scoredShots={scoredShots}
            missedShots={missedShots}
            accuracy={accuracy}
          />
          
          {/* Accuracy Display */}
          <AccuracyBar accuracy={accuracy} />
          
          {/* Tracking Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              type="button"
              onClick={onGoal}
              className="bg-brentwood-blue text-white font-bold py-4 px-6 rounded-lg shadow-md flex items-center justify-center h-16"
            >
              <i className="fas fa-check-circle text-2xl mr-2"></i>
              <span className="text-lg">Goal!</span>
            </Button>
            
            <Button
              type="button"
              onClick={onMiss}
              className="bg-brentwood-yellow text-black font-bold py-4 px-6 rounded-lg shadow-md flex items-center justify-center h-16"
            >
              <i className="fas fa-times-circle text-2xl mr-2"></i>
              <span className="text-lg">Miss</span>
            </Button>
          </div>
          
          {/* Coach Comments */}
          <FormField
            control={form.control}
            name="coachComment"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="block text-sm font-bold text-brentwood-blue mb-1">Comments</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any feedback or notes from this session"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={2}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Submit Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              type="submit"
              className="w-full bg-brentwood-blue hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Session"}
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => shareSession('whatsapp')}
                className="bg-[#25D366] text-white font-medium py-2 px-4 rounded-lg shadow-sm flex items-center justify-center"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                Share via WhatsApp
              </Button>
              
              <Button
                type="button"
                onClick={() => shareSession('email')}
                className="bg-brentwood-blue text-white font-medium py-2 px-4 rounded-lg shadow-sm flex items-center justify-center"
              >
                <i className="fas fa-envelope mr-2"></i>
                Share via Email
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SessionForm;

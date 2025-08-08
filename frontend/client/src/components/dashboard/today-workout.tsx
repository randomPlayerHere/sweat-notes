import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Dumbbell, RotateCcw, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { WorkoutPlan, InsertWorkout } from "@shared/schema";

interface TodayWorkoutProps {
  workoutPlans: WorkoutPlan[];
}

export default function TodayWorkout({ workoutPlans }: TodayWorkoutProps) {
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [workoutType, setWorkoutType] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const todayWorkout = workoutPlans.find(plan => plan.status === "today") || workoutPlans[0];

  const createWorkoutMutation = useMutation({
    mutationFn: async (workout: InsertWorkout) => {
      const response = await apiRequest("POST", "/api/workouts", workout);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workouts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-stats'] });
      toast({
        title: "Workout logged successfully!",
        description: "Your workout has been added to your history.",
      });
      setDuration("");
      setIntensity("");
      setWorkoutType("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!duration || !intensity || !workoutType) {
      toast({
        title: "Please fill all fields",
        description: "Duration, intensity, and workout type are required.",
        variant: "destructive",
      });
      return;
    }

    const workout: InsertWorkout = {
      name: todayWorkout?.name || "Custom Workout",
      type: workoutType,
      duration: parseInt(duration),
      intensity: parseInt(intensity),
      notes: "",
    };

    createWorkoutMutation.mutate(workout);
  };

  return (
    <div className="glass-card rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Today's Workout</h2>
        <Button className="bg-primary text-primary-foreground hover:bg-secondary">
          <Play className="w-4 h-4 mr-2" />
          Start Workout
        </Button>
      </div>
      
      {/* Current Workout Display */}
      {todayWorkout && (
        <div className="bg-surface rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary">{todayWorkout.name}</h3>
            <span className="text-sm text-text-secondary">~{todayWorkout.duration} min</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <span>
              <Dumbbell className="w-3 h-3 mr-1 inline" />
              {todayWorkout.exerciseCount} exercises
            </span>
            <span>
              <RotateCcw className="w-3 h-3 mr-1 inline" />
              Multiple sets
            </span>
            <span>
              <Target className="w-3 h-3 mr-1 inline" />
              {todayWorkout.focus.join(", ")}
            </span>
          </div>
        </div>
      )}

      {/* Quick Log Form */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium text-text-primary mb-3">Quick Log Workout</h4>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-sm font-medium text-text-secondary">Duration (min)</Label>
            <Input
              type="number"
              placeholder="45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-text-secondary">Intensity (1-10)</Label>
            <Select value={intensity} onValueChange={setIntensity}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} - {getIntensityLabel(num)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-text-secondary">Workout Type</Label>
            <Select value={workoutType} onValueChange={setWorkoutType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-secondary"
              disabled={createWorkoutMutation.isPending}
            >
              {createWorkoutMutation.isPending ? "Logging..." : "Log Workout"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getIntensityLabel(intensity: number): string {
  const labels = [
    "", "Very Light", "Light", "Easy", "Moderate", "Somewhat Hard",
    "Hard", "Very Hard", "Extremely Hard", "Maximum", "Absolute Max"
  ];
  return labels[intensity] || "";
}

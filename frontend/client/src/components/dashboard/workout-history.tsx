import { ArrowRight, Dumbbell, Heart } from "lucide-react";
import type { Workout } from "@shared/schema";

interface WorkoutHistoryProps {
  workouts: Workout[];
}

export default function WorkoutHistory({ workouts }: WorkoutHistoryProps) {
  const recentWorkouts = workouts.slice(0, 5);

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case "cardio":
        return Heart;
      default:
        return Dumbbell;
    }
  };

  if (recentWorkouts.length === 0) {
    return (
      <div className="glass-card rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Recent Workouts</h2>
        </div>
        <div className="text-center py-8">
          <Dumbbell className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No workouts yet. Start logging to see your history!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Recent Workouts</h2>
        <button className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          View All <ArrowRight className="w-3 h-3 ml-1 inline" />
        </button>
      </div>
      
      <div className="space-y-3">
        {recentWorkouts.map((workout) => {
          const WorkoutIcon = getWorkoutIcon(workout.type);
          
          return (
            <div 
              key={workout.id} 
              className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center">
                  <WorkoutIcon className="text-text-secondary w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">{workout.name}</p>
                  <p className="text-sm text-text-secondary">
                    {new Date(workout.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-text-secondary">{workout.duration} min</span>
                <div className="flex items-center space-x-1">
                  <span className="text-text-secondary">Intensity:</span>
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                    {workout.intensity}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { ArrowRight, Dumbbell, Heart, Flame, Clock, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
        </div>
        <div className="text-center py-8">
          <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No workouts yet. Start logging to see your history!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
      </div>
      
      <div className="space-y-3">
        {recentWorkouts.map((workout) => {
          const WorkoutIcon = getWorkoutIcon(workout.type);
          
          return (
            <div key={workout.id} className="border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <WorkoutIcon className="text-gray-600 w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{workout.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(workout.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-900">{workout.calories} cal</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{workout.duration}m</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

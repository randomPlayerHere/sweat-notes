import { TrendingUp, Clock, Flame, Zap } from "lucide-react";
import type { Workout, UserStats } from "@shared/schema";

interface MetricCardsProps {
  workouts: Workout[];
  userStats?: UserStats;
}

export default function MetricCards({ workouts, userStats }: MetricCardsProps) {
  // Calculate this week's workouts (last 7 days)
  const thisWeek = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;

  // Calculate average duration
  const avgDuration = workouts.length > 0 
    ? Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length)
    : 0;

  // Calculate total calories burned this week
  const caloriesBurned = workouts
    .filter(workout => {
      const workoutDate = new Date(workout.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate >= weekAgo;
    })
    .reduce((sum, w) => sum + w.calories, 0);

  // Week streak is same as current streak for simplicity
  const weekStreak = userStats?.currentStreak || 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">This Week</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{thisWeek}</div>
        <div className="text-xs text-gray-500">workouts</div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">Avg Duration</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{avgDuration}</div>
        <div className="text-xs text-gray-500">minutes</div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-gray-600">Calories Burned</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{caloriesBurned}</div>
        <div className="text-xs text-gray-500">calories</div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-gray-600">Week Streak</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{weekStreak}</div>
        <div className="text-xs text-gray-500">days</div>
      </div>
    </div>
  );
}
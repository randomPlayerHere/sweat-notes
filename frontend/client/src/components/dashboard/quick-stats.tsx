import { TrendingUp, Calendar, Clock, Trophy } from "lucide-react";
import type { Workout, UserStats } from "@shared/schema";

interface QuickStatsProps {
  workouts: Workout[];
  userStats?: UserStats;
}

export default function QuickStats({ workouts, userStats }: QuickStatsProps) {
  // Calculate weekly workouts (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyWorkouts = workouts.filter(w => new Date(w.date) >= weekAgo).length;

  // Calculate average duration
  const avgDuration = workouts.length > 0 
    ? Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length)
    : 0;

  const stats = [
    {
      label: "Total Workouts",
      value: userStats?.totalWorkouts || workouts.length,
      icon: TrendingUp,
    },
    {
      label: "This Week",
      value: weeklyWorkouts,
      icon: Calendar,
    },
    {
      label: "Avg Duration",
      value: `${avgDuration}min`,
      icon: Clock,
    },
    {
      label: "Best Streak",
      value: `${userStats?.bestStreak || 0} days`,
      icon: Trophy,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card rounded-xl shadow-sm p-6 workout-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            </div>
            <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center">
              <stat.icon className="text-text-secondary w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

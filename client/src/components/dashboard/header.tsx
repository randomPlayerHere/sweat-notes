import { Dumbbell, Calendar, Flame, User } from "lucide-react";
import type { UserStats } from "@shared/schema";

interface HeaderProps {
  userStats?: UserStats;
}

export default function Header({ userStats }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Dumbbell className="text-primary-foreground w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">CaloriePro</h1>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-surface rounded-lg px-3 py-2">
            <Calendar className="text-text-secondary w-4 h-4" />
            <span className="text-sm font-medium text-text-primary">Today, {currentDate}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Streak Counter */}
          <div className="flex items-center space-x-2 bg-primary text-primary-foreground rounded-lg px-4 py-2">
            <Flame className="text-orange-400 w-4 h-4" />
            <span className="font-semibold">{userStats?.totalWorkouts || 0}</span>
            <span className="text-sm">workouts logged</span>
          </div>
          
          {/* Quick Actions */}
          <button className="p-2 hover:bg-surface rounded-lg transition-colors">
            <User className="text-text-secondary w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

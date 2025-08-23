import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/dashboard/navigation";
import MetricCards from "@/components/dashboard/metric-cards";
import CalorieChart from "@/components/dashboard/intensity-chart";
import Recommendations from "@/components/dashboard/recommendations";
import WorkoutHistory from "@/components/dashboard/workout-history";
import { Flame, Settings, PlusCircle } from "lucide-react";
import type { Workout, UserStats } from "@shared/schema";

export default function Dashboard() {
  const { data: workouts, isLoading: workoutsLoading } = useQuery<Workout[]>({
    queryKey: ['/api/workouts'],
  });

  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['/api/user-stats'],
  });

  const isLoading = workoutsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your fitness dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Development Mode Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 px-6 py-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Development Mode:</span> Using mock data because backend is not available. Backend server is not running. Please start your Spring Boot application on http://localhost:8080
            </p>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-6 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, John!</h1>
              <p className="text-gray-600">Ready to crush your fitness goals today?</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <PlusCircle className="w-4 h-4" />
                <span>Log Workout</span>
              </button>
            </div>
          </div>
          
          {/* Streak Card */}
          <div className="bg-gray-900 text-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-gray-300">Current Streak</span>
                </div>
                <div className="text-2xl font-bold">{userStats?.currentStreak || 0} days</div>
              </div>
              <div className="text-right text-sm text-gray-300">
                <div>🏆 Best: {userStats?.bestStreak || 0} days</div>
                <div>{userStats?.totalWorkouts || 0} workouts logged</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Metric Cards */}
        <MetricCards workouts={workouts || []} userStats={userStats} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <CalorieChart workouts={workouts || []} />
          </div>
          <div>
            <Recommendations />
          </div>
        </div>
        
        {/* Recent Workouts */}
        <WorkoutHistory workouts={workouts || []} />
      </main>
    </div>
  );
}

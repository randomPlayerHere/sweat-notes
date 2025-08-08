import { useQuery } from "@tanstack/react-query";
import Header from "@/components/dashboard/header";
import IntensityChart from "@/components/dashboard/intensity-chart";
import QuickStats from "@/components/dashboard/quick-stats";
import TodayWorkout from "@/components/dashboard/today-workout";
import WorkoutHistory from "@/components/dashboard/workout-history";
import WorkoutPlanSidebar from "@/components/dashboard/workout-plan-sidebar";
import type { Workout, UserStats, WorkoutPlan } from "@shared/schema";

export default function Dashboard() {
  const { data: workouts, isLoading: workoutsLoading } = useQuery<Workout[]>({
    queryKey: ['/api/workouts'],
  });

  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['/api/user-stats'],
  });

  const { data: workoutPlans, isLoading: plansLoading } = useQuery<WorkoutPlan[]>({
    queryKey: ['/api/workout-plans'],
  });

  const isLoading = workoutsLoading || statsLoading || plansLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your fitness dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userStats={userStats} />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <IntensityChart workouts={workouts || []} />
          <QuickStats workouts={workouts || []} userStats={userStats} />
          <TodayWorkout workoutPlans={workoutPlans || []} />
          <WorkoutHistory workouts={workouts || []} />
        </main>
      </div>

      {/* Right Sidebar - Workout Plan */}
      <WorkoutPlanSidebar workoutPlans={workoutPlans || []} />
    </div>
  );
}

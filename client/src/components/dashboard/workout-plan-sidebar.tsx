import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import type { WorkoutPlan } from "@shared/schema";

interface WorkoutPlanSidebarProps {
  workoutPlans: WorkoutPlan[];
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function WorkoutPlanSidebar({ workoutPlans }: WorkoutPlanSidebarProps) {
  const [currentWeek, setCurrentWeek] = useState(3);
  const totalWeeks = 12;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "today":
        return "bg-primary text-primary-foreground";
      case "completed":
        return "bg-green-500 text-white";
      case "rest":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "today":
        return "Today";
      case "completed":
        return "Done";
      case "rest":
        return "Rest";
      case "flexible":
        return "Flexible";
      default:
        return "Upcoming";
    }
  };

  const previousWeek = () => {
    if (currentWeek > 1) setCurrentWeek(currentWeek - 1);
  };

  const nextWeek = () => {
    if (currentWeek < totalWeeks) setCurrentWeek(currentWeek + 1);
  };

  return (
    <div className="w-80 bg-surface border-l border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Complete Workout Plan</h2>
        <p className="text-sm text-text-secondary">Your personalized fitness program</p>
      </div>
      
      <div className="flex-1 overflow-auto sidebar-scroll p-6 space-y-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-text-primary">
            Week {currentWeek} of {totalWeeks}
          </span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={previousWeek}
              disabled={currentWeek <= 1}
              className="p-1 hover:bg-background rounded transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-3 h-3 text-text-secondary" />
            </button>
            <button 
              onClick={nextWeek}
              disabled={currentWeek >= totalWeeks}
              className="p-1 hover:bg-background rounded transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-3 h-3 text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Weekly Plan */}
        <div className="space-y-4">
          {workoutPlans.map((plan) => (
            <div key={plan.id} className="bg-background rounded-lg p-4 shadow-sm border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-text-primary">
                  {dayNames[plan.dayOfWeek]}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(plan.status)}`}>
                  {getStatusLabel(plan.status)}
                </span>
              </div>
              
              {plan.status !== "rest" ? (
                <div className="space-y-2">
                  <div className="text-sm">
                    <p className="font-medium text-text-primary">{plan.name}</p>
                    <p className="text-text-secondary text-xs">
                      {plan.duration} min • {plan.exerciseCount} exercises
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {plan.focus.map((focus, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm">
                  <p className="font-medium text-text-primary">{plan.name}</p>
                  <p className="text-text-secondary text-xs">
                    {plan.duration} min • Light stretching
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-border">
        <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-secondary transition-colors mb-3">
          <Edit className="w-4 h-4 mr-2 inline" />
          Edit Plan
        </button>
        <div className="text-center">
          <p className="text-xs text-text-secondary">
            Progress: <span className="font-medium">65%</span> complete
          </p>
          <div className="w-full bg-muted rounded-full h-1 mt-1">
            <div className="bg-primary h-1 rounded-full" style={{ width: "65%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, Target, Plus, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/dashboard/navigation";
import type { WorkoutPlan } from "@shared/schema";

export default function Plans() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: workoutPlans, isLoading } = useQuery<WorkoutPlan[]>({
    queryKey: ['/api/workout-plans'],
  });

  // Generate AI workout recommendations using Flask RAG API
  const generateRecommendations = useMutation({
    mutationFn: async (preferences: any) => {
      try {
        // TODO: Replace with your Flask RAG API endpoint
        const response = await fetch('http://localhost:5002/generate-workout-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fitness_level: preferences.fitnessLevel || 'intermediate',
            goals: preferences.goals || ['general_fitness'],
            available_days: preferences.availableDays || 5,
            workout_duration: preferences.duration || 45,
            equipment: preferences.equipment || ['bodyweight']
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate recommendations');
        }
        
        return await response.json();
      } catch (error) {
        // Fallback to static recommendations
        return {
          recommended_plans: [
            {
              name: "AI Strength Training",
              dayOfWeek: 1,
              duration: 45,
              exerciseCount: 8,
              focus: ["strength", "upper_body"],
              status: "upcoming",
              week: 1
            },
            {
              name: "AI Cardio Blast",
              dayOfWeek: 3,
              duration: 30,
              exerciseCount: 6,
              focus: ["cardio", "endurance"],
              status: "upcoming", 
              week: 1
            }
          ]
        };
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Generated ${data.recommended_plans.length} AI workout recommendations!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/workout-plans'] });
    },
    onError: () => {
      toast({
        title: "Info",
        description: "Using fallback workout recommendations (AI service unavailable)",
      });
    }
  });

  const handleGenerateRecommendations = () => {
    generateRecommendations.mutate({
      fitnessLevel: 'intermediate',
      goals: ['strength', 'endurance'],
      availableDays: 4,
      duration: 45,
      equipment: ['bodyweight', 'dumbbells']
    });
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'today':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-gray-100 text-gray-800';
      case 'rest':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading workout plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="mb-6">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Workout Plans</h1>
              <p className="text-gray-600">Your weekly workout schedule</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleGenerateRecommendations}
                disabled={generateRecommendations.isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50"
                data-testid="button-ai-recommendations"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generateRecommendations.isPending ? 'Generating...' : 'AI Recommendations'}</span>
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-gray-800"
                data-testid="button-create-plan"
              >
                <Plus className="w-4 h-4" />
                <span>Create Plan</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workoutPlans?.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg border border-gray-200 p-6" data-testid={`card-plan-${plan.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{getDayName(plan.dayOfWeek)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600" data-testid={`button-edit-${plan.id}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{plan.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{plan.exerciseCount} exercises</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Focus Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.focus.map((area, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {plan.status === 'today' && (
                  <button
                    className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                    data-testid={`button-start-${plan.id}`}
                  >
                    Start Workout
                  </button>
                )}
                {plan.status === 'upcoming' && (
                  <button
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                    data-testid={`button-preview-${plan.id}`}
                  >
                    Preview
                  </button>
                )}
                {plan.status === 'completed' && (
                  <button
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                    data-testid={`button-view-${plan.id}`}
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {workoutPlans && workoutPlans.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workout plans yet</h3>
            <p className="text-gray-600 mb-6">Get personalized workout recommendations powered by AI, or create your own plan.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleGenerateRecommendations}
                disabled={generateRecommendations.isPending}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                data-testid="button-generate-ai-plans"
              >
                <Sparkles className="w-5 h-5" />
                <span>{generateRecommendations.isPending ? 'Generating...' : 'Get AI Recommendations'}</span>
              </button>
              <button
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
                data-testid="button-create-first-plan"
              >
                Create Your First Plan
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
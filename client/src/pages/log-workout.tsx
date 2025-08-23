import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Calendar, Clock, Zap, Flame } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/dashboard/navigation";

export default function LogWorkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    type: "cardio",
    duration: "",
    intensity: "5",
    notes: ""
  });

  const [predictedCalories, setPredictedCalories] = useState<number | null>(null);
  const [isCaloriePredicting, setIsCaloriePredicting] = useState(false);

  // Function to predict calories using Flask ML API
  const predictCalories = async () => {
    if (!formData.name || !formData.type || !formData.duration || !formData.intensity) {
      toast({
        title: "Error",
        description: "Please fill in workout details before predicting calories.",
        variant: "destructive",
      });
      return;
    }

    setIsCaloriePredicting(true);
    try {
      // TODO: Replace with your Flask ML API endpoint
      const response = await fetch('http://localhost:5001/predict-calories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workout_type: formData.type,
          duration: parseInt(formData.duration),
          intensity: parseInt(formData.intensity),
          workout_name: formData.name
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to predict calories');
      }
      
      const result = await response.json();
      setPredictedCalories(result.predicted_calories);
      
      toast({
        title: "Success",
        description: `Predicted calories: ${result.predicted_calories}`,
      });
    } catch (error) {
      // For now, use a simple calculation as fallback
      const fallbackCalories = calculateFallbackCalories(formData.type, parseInt(formData.duration), parseInt(formData.intensity));
      setPredictedCalories(fallbackCalories);
      
      toast({
        title: "Info",
        description: `Using estimated calories: ${fallbackCalories} (ML API unavailable)`,
      });
    } finally {
      setIsCaloriePredicting(false);
    }
  };

  // Fallback calorie calculation
  const calculateFallbackCalories = (type: string, duration: number, intensity: number) => {
    const baseRates: { [key: string]: number } = {
      cardio: 8,
      strength: 6,
      flexibility: 3,
      sports: 7,
      other: 5
    };
    
    const baseRate = baseRates[type] || 5;
    return Math.round(baseRate * duration * (intensity / 5));
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (!predictedCalories) {
        throw new Error('Please predict calories first');
      }
      
      return apiRequest('/api/workouts', 'POST', {
        ...data,
        duration: parseInt(data.duration),
        intensity: parseInt(data.intensity),
        calories: predictedCalories
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Workout logged successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/workouts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-stats'] });
      setLocation('/');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.duration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!predictedCalories) {
      toast({
        title: "Error",
        description: "Please predict calories before logging the workout.",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-6 py-6 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Log New Workout</h1>
          <p className="text-gray-600">Track your exercise with AI-powered calorie prediction</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g. Morning Run"
                  data-testid="input-workout-name"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  data-testid="select-workout-type"
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength Training</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="30"
                  data-testid="input-duration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Flame className="w-4 h-4 inline mr-1" />
                  Predicted Calories
                </label>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={predictedCalories ? `${predictedCalories} calories` : 'Not predicted yet'}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                      data-testid="display-predicted-calories"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={predictCalories}
                    disabled={isCaloriePredicting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                    data-testid="button-predict-calories"
                  >
                    {isCaloriePredicting ? 'Predicting...' : 'Predict'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">AI will predict calories based on your workout details</p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="intensity" className="block text-sm font-medium text-gray-700 mb-2">
                  <Zap className="w-4 h-4 inline mr-1" />
                  Intensity Level: {formData.intensity}/10
                </label>
                <input
                  type="range"
                  id="intensity"
                  name="intensity"
                  min="1"
                  max="10"
                  value={formData.intensity}
                  onChange={handleChange}
                  className="w-full"
                  data-testid="slider-intensity"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Easy</span>
                  <span>Moderate</span>
                  <span>Intense</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="How did it go? Any observations..."
                  data-testid="textarea-notes"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setLocation('/')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                data-testid="button-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || !predictedCalories}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                data-testid="button-submit"
              >
                {mutation.isPending ? "Logging..." : "Log Workout"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
import { Sparkles, Play } from "lucide-react";

export default function Recommendations() {
  const recommendations = [
    {
      id: 1,
      title: "Upper Body Strength",
      description: "Based on your recent cardio focus, try some strength training",
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: 2,
      title: "HIIT Session", 
      description: "Perfect for your fitness goals and time constraints",
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">Recommended For You</h3>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${rec.color}`}>
                <Play className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{rec.title}</p>
                <p className="text-xs text-gray-600">{rec.description}</p>
              </div>
            </div>
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
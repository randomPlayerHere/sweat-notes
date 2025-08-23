import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { Workout } from "@shared/schema";

interface CalorieChartProps {
  workouts: Workout[];
}

export default function CalorieChart({ workouts }: CalorieChartProps) {
  // Get last 7 days of workouts and calculate intensity data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = last7Days.map(date => {
    const dateStr = date.toLocaleDateString();
    const workout = workouts.find(w => 
      new Date(w.date).toLocaleDateString() === dateStr
    );
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: workout?.calories || 0,
      name: workout?.name || 'Rest Day',
    };
  });

  const totalCaloriesToday = workouts.length > 0 ? workouts[0]?.calories || 0 : 0;
  const avgCaloriesPerDay = chartData.reduce((sum, day) => sum + day.calories, 0) / 7;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Calorie Burn Trends</h3>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Last 7 days</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [`${value} calories`, 'Calories Burned']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#000000"
              strokeWidth={2}
              dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#000000' }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { Workout } from "@shared/schema";

interface IntensityChartProps {
  workouts: Workout[];
}

export default function IntensityChart({ workouts }: IntensityChartProps) {
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
      intensity: workout?.intensity || 0,
    };
  });

  const currentIntensity = workouts.length > 0 ? workouts[0]?.intensity || 0 : 0;

  return (
    <div className="glass-card rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Workout Intensity Trends</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Last 7 days</span>
          <div className="intensity-badge bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
            Current: {currentIntensity}/10
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--text-secondary))', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 10]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--text-secondary))', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="intensity"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

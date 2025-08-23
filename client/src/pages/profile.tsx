import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Edit, Settings, Trophy, Calendar, Flame } from "lucide-react";
import { useLocation } from "wouter";
import Navigation from "@/components/dashboard/navigation";
import type { UserStats, Workout } from "@shared/schema";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: userStats } = useQuery<UserStats>({
    queryKey: ['/api/user-stats'],
  });

  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ['/api/workouts'],
  });

  // Calculate some profile stats
  const totalCaloriesBurned = workouts?.reduce((sum, workout) => sum + workout.calories, 0) || 0;
  const averageWorkoutDuration = workouts && workouts.length > 0 
    ? Math.round(workouts.reduce((sum, workout) => sum + workout.duration, 0) / workouts.length)
    : 0;

  const workoutTypes = workouts?.reduce((acc: Record<string, number>, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {}) || {};

  const favoriteWorkoutType = Object.keys(workoutTypes).length > 0 
    ? Object.entries(workoutTypes).sort(([,a], [,b]) => b - a)[0][0]
    : 'None';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-6 py-6 max-w-4xl">
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-gray-600">Manage your account and view your fitness journey</p>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              data-testid="button-edit-profile"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
                  <p className="text-gray-600">Fitness Enthusiast</p>
                  <p className="text-sm text-gray-500">Member since January 2024</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      data-testid="input-full-name"
                    />
                  ) : (
                    <p className="text-gray-900">John Doe</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      defaultValue="john.doe@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      data-testid="input-email"
                    />
                  ) : (
                    <p className="text-gray-900">john.doe@example.com</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      defaultValue="28"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      data-testid="input-age"
                    />
                  ) : (
                    <p className="text-gray-900">28 years old</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                  {isEditing ? (
                    <select
                      defaultValue="weight-loss"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      data-testid="select-goal"
                    >
                      <option value="weight-loss">Weight Loss</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="endurance">Endurance</option>
                      <option value="general-fitness">General Fitness</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">Weight Loss</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    data-testid="button-cancel-edit"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    data-testid="button-save-profile"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive workout reminders and updates</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    data-testid="checkbox-email-notifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Get notified about workout reminders</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    data-testid="checkbox-push-notifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Weekly Reports</p>
                    <p className="text-sm text-gray-600">Receive weekly progress summaries</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    data-testid="checkbox-weekly-reports"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Stats
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Workouts</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-total-workouts">
                    {userStats?.totalWorkouts || 0}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <div className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <p className="text-2xl font-bold text-gray-900" data-testid="text-current-streak">
                      {userStats?.currentStreak || 0} days
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Best Streak</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-best-streak">
                    {userStats?.bestStreak || 0} days
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total Calories Burned</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-total-calories">
                    {totalCaloriesBurned.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Avg Workout Duration</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-avg-duration">
                    {averageWorkoutDuration} min
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Favorite Workout Type</p>
                  <p className="text-lg font-medium text-gray-900 capitalize" data-testid="text-favorite-type">
                    {favoriteWorkoutType}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Activity
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="font-medium text-gray-900">
                    {workouts?.filter(w => {
                      const workoutDate = new Date(w.date);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return workoutDate >= weekAgo;
                    }).length || 0} workouts
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-medium text-gray-900">
                    {workouts?.filter(w => {
                      const workoutDate = new Date(w.date);
                      const monthAgo = new Date();
                      monthAgo.setDate(monthAgo.getDate() - 30);
                      return workoutDate >= monthAgo;
                    }).length || 0} workouts
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Workout</span>
                  <span className="font-medium text-gray-900">
                    {workouts && workouts.length > 0 
                      ? new Date(workouts[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
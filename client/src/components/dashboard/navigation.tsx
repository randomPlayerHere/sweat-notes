import { Calendar, PlusCircle, FileText, User, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path ? "bg-black text-white" : "text-gray-600 hover:text-gray-900";
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">Fit</span>
              </div>
              <span className="font-semibold text-gray-900">FitTracker</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${isActive("/")}`}>
                Dashboard
              </button>
            </Link>
            <Link href="/log-workout">
              <button className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-lg ${isActive("/log-workout")}`}>
                <PlusCircle className="w-4 h-4" />
                <span>Log Workout</span>
              </button>
            </Link>
            <Link href="/plans">
              <button className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-lg ${isActive("/plans")}`}>
                <FileText className="w-4 h-4" />
                <span>Plans</span>
              </button>
            </Link>
            <Link href="/profile">
              <button className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-lg ${isActive("/profile")}`}>
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Settings className="w-4 h-4" />
          </button>
          <Link href="/log-workout">
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
              Log Workout
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_URLS } from "@/config/api";
import { useAuth } from "@/contexts/auth-context";

type User = {
  id: string;
  mail: string;
  username: string;
};

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  
  const checkUserMutation = useMutation({
    mutationFn: async (userEmail: string) => {
      const response = await fetch(API_URLS.USERS);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const users: User[] = await response.json();
      const user = users.find(u => u.mail === userEmail);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      return user;
    },
    onSuccess: (user: User) => {
      login({
        id: user.id,
        email: user.mail,
        username: user.username
      });
      
      toast({
        title: "Success",
        description: `Welcome back, ${user.username}!`,
      });
      
      // Redirect to dashboard after successful login
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }
    checkUserMutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={checkUserMutation.isPending}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                >
                  {checkUserMutation.isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in with Email'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-black hover:text-gray-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

# Frontend API Integration Guide

This document explains how the React frontend connects to your Spring Boot backend and what you need to configure.

## Current Frontend API Structure

### API Client Configuration (client/src/lib/queryClient.ts)

The frontend uses a centralized API client with these key functions:

```typescript
// Main API request function used for POST/PUT/DELETE operations
export async function apiRequest(
  method: string,
  url: string, 
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Important: sends cookies/auth headers
  });
  
  await throwIfResNotOk(res); // Throws error if response not ok
  return res;
}

// Query function for GET requests (used by React Query)
const getQueryFn = (unauthorizedBehavior?: "returnNull" | "throw"): QueryFunction => {
  return async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include", // Important: sends cookies/auth headers
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };
};
```

## How Frontend Makes API Calls

### 1. GET Requests (Data Fetching)
The frontend uses React Query's `useQuery` hook:

```typescript
// Example from client/src/pages/dashboard.tsx
const { data: workouts, isLoading: workoutsLoading } = useQuery<Workout[]>({
  queryKey: ['/api/workouts'], // This becomes the URL: /api/workouts
});

const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
  queryKey: ['/api/user-stats'], // This becomes: /api/user-stats
});

const { data: workoutPlans, isLoading: plansLoading } = useQuery<WorkoutPlan[]>({
  queryKey: ['/api/workout-plans'], // This becomes: /api/workout-plans
});
```

### 2. POST/PUT/DELETE Requests (Mutations)
The frontend uses React Query's `useMutation` hook:

```typescript
// Example from client/src/components/dashboard/today-workout.tsx
const createWorkoutMutation = useMutation({
  mutationFn: async (workout: InsertWorkout) => {
    // This calls your Spring Boot POST /api/workouts endpoint
    const response = await apiRequest("POST", "/api/workouts", workout);
    return response.json();
  },
  onSuccess: () => {
    // Refresh the data after successful creation
    queryClient.invalidateQueries({ queryKey: ['/api/workouts'] });
    queryClient.invalidateQueries({ queryKey: ['/api/user-stats'] });
    
    // Show success message
    toast({
      title: "Workout logged successfully!",
      description: "Your workout has been added to your history.",
    });
  },
  onError: () => {
    // Show error message
    toast({
      title: "Error",
      description: "Failed to log workout. Please try again.",
      variant: "destructive",
    });
  },
});

// To use the mutation in a form submit:
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const workout = {
    name: `${getWorkoutTypeLabel(workoutType)} Session`,
    type: workoutType,
    duration: parseInt(duration),
    intensity: parseInt(intensity),
    notes: "",
  };
  
  createWorkoutMutation.mutate(workout); // This triggers the API call
};
```

## Backend URL Configuration

### Current Setup (Development)
The frontend currently connects to `http://localhost:5000` (same port as current Express server).

### For Your Spring Boot Backend

You have two options:

#### Option 1: Same Port (Recommended)
Run your Spring Boot backend on port 5000:
```yaml
# application.yml
server:
  port: 5000
```

#### Option 2: Different Port (Requires Frontend Changes)
If you want to run Spring Boot on a different port (e.g., 8080), you'll need to update the frontend:

1. Create an environment configuration:
```typescript
// client/src/lib/config.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
```

2. Update the API client to use the base URL:
```typescript
// In queryClient.ts
const res = await fetch(`${API_BASE_URL}${queryKey.join("/")}`, {
  credentials: "include",
});

// For apiRequest function:
const res = await fetch(`${API_BASE_URL}${url}`, {
  method,
  headers: data ? { "Content-Type": "application/json" } : {},
  body: data ? JSON.stringify(data) : undefined,
  credentials: "include",
});
```

3. Set environment variable:
```bash
# In .env.local (create this file)
VITE_API_BASE_URL=http://localhost:8080
```

## CORS Configuration for Spring Boot

Your Spring Boot backend MUST configure CORS to allow the frontend to make requests:

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5000") // Frontend URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // Important: allows cookies/auth
    }
}
```

Or using annotations on controllers:
```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5000", allowCredentials = true)
public class WorkoutController {
    // Your endpoints...
}
```

## Error Handling Expected by Frontend

The frontend expects specific error response formats:

### Validation Errors (400 Bad Request)
```json
{
  "message": "Invalid workout data",
  "errors": [
    {
      "field": "type",
      "message": "must be one of: strength, cardio, flexibility, sports, other"
    }
  ]
}
```

### Generic Errors (500 Internal Server Error)
```json
{
  "message": "Failed to create workout"
}
```

### Not Found Errors (404 Not Found)
```json
{
  "message": "Workout not found"
}
```

## Data Types Expected by Frontend

The frontend uses these TypeScript interfaces (from shared/schema.ts):

### Workout Type
```typescript
export type Workout = {
  id: string;              // UUID string
  name: string;            // Workout name
  type: string;            // "strength" | "cardio" | "flexibility" | "sports" | "other"
  duration: number;        // Minutes (integer)
  intensity: number;       // 1-10 scale (integer)
  date: Date;              // ISO datetime string
  notes: string | null;    // Optional notes
};

export type InsertWorkout = {
  name: string;            // Required
  type: string;            // Required
  duration: number;        // Required
  intensity: number;       // Required  
  notes?: string;          // Optional
};
```

### WorkoutPlan Type
```typescript
export type WorkoutPlan = {
  id: string;                    // UUID string
  dayOfWeek: number;            // 1-7 (Monday-Sunday)
  name: string;                 // Plan name
  duration: number;             // Minutes
  exerciseCount: number;        // Number of exercises
  focus: string[];              // Array of focus areas
  status: string;               // "today" | "completed" | "upcoming" | "rest" | "flexible"
  week: number;                 // Week number
};
```

### UserStats Type
```typescript
export type UserStats = {
  id: string;                      // UUID string
  currentStreak: number;           // Current streak count
  bestStreak: number;              // Best streak achieved
  totalWorkouts: number;           // Total workouts completed
  lastWorkoutDate: Date | null;    // ISO datetime string or null
};
```

## Testing Your Backend Integration

Once your Spring Boot backend is running, you can test the integration:

1. **Start your Spring Boot server** on port 5000 (or configure frontend for different port)

2. **The frontend will automatically connect** - no code changes needed if using port 5000

3. **Test each endpoint**:
   - Visit the dashboard - should load workout data
   - Try logging a new workout - should create and refresh data  
   - Check if user stats update after logging workouts

4. **Monitor browser developer tools**:
   - Network tab shows all API requests
   - Console shows any CORS or network errors
   - React Query DevTools (if installed) shows query status

## Key Points for Success

1. **CORS is critical** - without proper CORS configuration, the frontend cannot connect
2. **Use exact same response formats** - the frontend expects specific JSON structures
3. **Handle all HTTP status codes** - 200, 201, 204, 400, 404, 500
4. **Include proper validation** - return 400 with field-specific errors
5. **UUID generation** - use proper UUID format for IDs
6. **Date formatting** - return ISO datetime strings
7. **Credential support** - allow credentials for future authentication features

The frontend is already fully implemented and will work seamlessly with your Spring Boot backend once you implement the endpoints according to the API documentation!
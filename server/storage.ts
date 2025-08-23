import { type Workout, type InsertWorkout, type WorkoutPlan, type InsertWorkoutPlan, type UserStats, type InsertUserStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Workouts
  getWorkouts(): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  deleteWorkout(id: string): Promise<boolean>;
  
  // Workout Plans
  getWorkoutPlans(): Promise<WorkoutPlan[]>;
  getWorkoutPlan(id: string): Promise<WorkoutPlan | undefined>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  updateWorkoutPlan(id: string, plan: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined>;
  deleteWorkoutPlan(id: string): Promise<boolean>;
  
  // User Stats
  getUserStats(): Promise<UserStats>;
  updateUserStats(stats: Partial<InsertUserStats>): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private workouts: Map<string, Workout>;
  private workoutPlans: Map<string, WorkoutPlan>;
  private userStats: UserStats;

  constructor() {
    this.workouts = new Map();
    this.workoutPlans = new Map();
    this.userStats = {
      id: randomUUID(),
      currentStreak: 7,
      bestStreak: 15,
      totalWorkouts: 42,
      lastWorkoutDate: new Date(),
    };
    
    // Initialize with sample data
    this.initializeWorkouts();
    this.initializeWorkoutPlans();
  }

  private initializeWorkouts() {
    const sampleWorkouts = [
      {
        name: "Morning Cardio",
        type: "cardio",
        duration: 30,
        intensity: 7,
        calories: 250,
        notes: "Great morning run",
        exercises: ["Running", "Cool down walk"],
        date: new Date(Date.now() - 24 * 60 * 60 * 1000) // yesterday
      },
      {
        name: "Strength Training",
        type: "strength",
        duration: 45,
        intensity: 8,
        calories: 320,
        notes: "Upper body focus",
        exercises: ["Push-ups", "Pull-ups", "Bench press", "Shoulder press"],
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        name: "Yoga Flow",
        type: "flexibility",
        duration: 60,
        intensity: 4,
        calories: 180,
        notes: "Relaxing session",
        exercises: ["Sun salutation", "Warrior poses", "Downward dog", "Savasana"],
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        name: "HIIT Workout",
        type: "cardio",
        duration: 25,
        intensity: 9,
        calories: 400,
        notes: "Intense session!",
        exercises: ["Burpees", "Jump squats", "Mountain climbers", "High knees"],
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        name: "Swimming",
        type: "cardio",
        duration: 40,
        intensity: 6,
        calories: 290,
        notes: "Pool session",
        exercises: ["Freestyle", "Backstroke", "Water jogging"],
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        name: "Lower Body Strength",
        type: "strength",
        duration: 50,
        intensity: 8,
        calories: 350,
        notes: "Leg day complete",
        exercises: ["Squats", "Deadlifts", "Lunges", "Calf raises"],
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
      },
      {
        name: "Evening Walk",
        type: "cardio",
        duration: 35,
        intensity: 3,
        calories: 150,
        notes: "Peaceful evening",
        exercises: ["Brisk walking", "Light stretching"],
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      }
    ];

    sampleWorkouts.forEach(workout => {
      const id = randomUUID();
      this.workouts.set(id, { 
        ...workout, 
        id,
        notes: workout.notes || null,
        exercises: workout.exercises || null
      });
    });
  }

  private initializeWorkoutPlans() {
    const plans: InsertWorkoutPlan[] = [
      {
        dayOfWeek: 1,
        name: "Upper Body Strength",
        duration: 45,
        exerciseCount: 6,
        focus: ["Chest", "Back", "Arms"],
        status: "today",
        week: 3,
      },
      {
        dayOfWeek: 2,
        name: "Active Recovery",
        duration: 20,
        exerciseCount: 0,
        focus: ["Stretching"],
        status: "rest",
        week: 3,
      },
      {
        dayOfWeek: 3,
        name: "Lower Body Power",
        duration: 50,
        exerciseCount: 7,
        focus: ["Legs", "Glutes", "Core"],
        status: "upcoming",
        week: 3,
      },
      {
        dayOfWeek: 4,
        name: "Cardio Intervals",
        duration: 35,
        exerciseCount: 5,
        focus: ["Cardio", "Endurance"],
        status: "upcoming",
        week: 3,
      },
      {
        dayOfWeek: 5,
        name: "Full Body Circuit",
        duration: 40,
        exerciseCount: 8,
        focus: ["Full Body", "Functional"],
        status: "upcoming",
        week: 3,
      },
      {
        dayOfWeek: 6,
        name: "Outdoor Activity",
        duration: 60,
        exerciseCount: 0,
        focus: ["Cardio", "Recreation"],
        status: "flexible",
        week: 3,
      },
    ];

    plans.forEach(plan => {
      const id = randomUUID();
      this.workoutPlans.set(id, { 
        ...plan, 
        id,
        status: plan.status || 'upcoming',
        week: plan.week || 1
      });
    });
  }

  // Workouts
  async getWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const workout: Workout = { 
      ...insertWorkout, 
      id, 
      date: new Date(),
      exercises: null // Default null exercises array
    };
    this.workouts.set(id, workout);
    
    // Update user stats
    this.userStats.totalWorkouts++;
    this.updateStreak();
    this.userStats.lastWorkoutDate = new Date();
    
    return workout;
  }

  async deleteWorkout(id: string): Promise<boolean> {
    return this.workouts.delete(id);
  }

  // Workout Plans
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values()).sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  }

  async getWorkoutPlan(id: string): Promise<WorkoutPlan | undefined> {
    return this.workoutPlans.get(id);
  }

  async createWorkoutPlan(insertPlan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const id = randomUUID();
    const plan: WorkoutPlan = { ...insertPlan, id };
    this.workoutPlans.set(id, plan);
    return plan;
  }

  async updateWorkoutPlan(id: string, updatePlan: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined> {
    const existing = this.workoutPlans.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updatePlan };
    this.workoutPlans.set(id, updated);
    return updated;
  }

  async deleteWorkoutPlan(id: string): Promise<boolean> {
    return this.workoutPlans.delete(id);
  }

  // User Stats
  async getUserStats(): Promise<UserStats> {
    return this.userStats;
  }

  async updateUserStats(stats: Partial<InsertUserStats>): Promise<UserStats> {
    this.userStats = { ...this.userStats, ...stats };
    return this.userStats;
  }

  private updateStreak() {
    const today = new Date();
    const lastWorkout = this.userStats.lastWorkoutDate;
    
    if (!lastWorkout) {
      this.userStats.currentStreak = 1;
      return;
    }
    
    const daysDiff = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      this.userStats.currentStreak++;
      if (this.userStats.currentStreak > this.userStats.bestStreak) {
        this.userStats.bestStreak = this.userStats.currentStreak;
      }
    } else if (daysDiff > 1) {
      // Streak broken
      this.userStats.currentStreak = 1;
    }
    // If daysDiff === 0, it's the same day, don't change streak
  }
}

export const storage = new MemStorage();

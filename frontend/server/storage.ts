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
      currentStreak: 12,
      bestStreak: 18,
      totalWorkouts: 147,
      lastWorkoutDate: new Date(),
    };
    
    // Initialize with sample workout plans
    this.initializeWorkoutPlans();
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
      this.workoutPlans.set(id, { ...plan, id });
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
      date: new Date() 
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

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // strength, cardio, flexibility, sports, other
  duration: integer("duration").notNull(), // in minutes
  intensity: integer("intensity").notNull(), // 1-10 scale
  calories: integer("calories").notNull(), // estimated calories burned
  date: timestamp("date").notNull().defaultNow(),
  notes: text("notes"),
  exercises: text("exercises").array().default([]), // list of exercises performed
});

export const workoutPlans = pgTable("workout_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  name: text("name").notNull(),
  duration: integer("duration").notNull(), // in minutes
  exerciseCount: integer("exercise_count").notNull(),
  focus: text("focus").array().notNull(), // muscle groups or focus areas
  status: text("status").notNull().default("upcoming"), // today, completed, upcoming, rest
  week: integer("week").notNull().default(1),
});

export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  currentStreak: integer("current_streak").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  totalWorkouts: integer("total_workouts").notNull().default(0),
  lastWorkoutDate: timestamp("last_workout_date"),
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  date: true,
  exercises: true,
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
});

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type UserStats = typeof userStats.$inferSelect;

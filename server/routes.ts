import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkoutSchema, insertWorkoutPlanSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Workouts routes
  app.get("/api/workouts", async (req, res) => {
    try {
      const workouts = await storage.getWorkouts();
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const validatedData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(validatedData);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid workout data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create workout" });
      }
    }
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWorkout(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Workout not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workout" });
    }
  });

  // Workout Plans routes
  app.get("/api/workout-plans", async (req, res) => {
    try {
      const plans = await storage.getWorkoutPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout plans" });
    }
  });

  app.post("/api/workout-plans", async (req, res) => {
    try {
      const validatedData = insertWorkoutPlanSchema.parse(req.body);
      const plan = await storage.createWorkoutPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid workout plan data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create workout plan" });
      }
    }
  });

  app.put("/api/workout-plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertWorkoutPlanSchema.partial().parse(req.body);
      const plan = await storage.updateWorkoutPlan(id, validatedData);
      if (plan) {
        res.json(plan);
      } else {
        res.status(404).json({ message: "Workout plan not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid workout plan data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update workout plan" });
      }
    }
  });

  // User Stats routes
  app.get("/api/user-stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

package com.fittracker.controller;

import com.fittracker.model.WorkoutPlan;
import com.fittracker.service.WorkoutPlanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workout-plans")
@CrossOrigin(origins = "*")
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanService workoutPlanService;

    @GetMapping
    public ResponseEntity<List<WorkoutPlan>> getAllWorkoutPlans() {
        List<WorkoutPlan> plans = workoutPlanService.getAllWorkoutPlans();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutPlan> getWorkoutPlanById(@PathVariable String id) {
        Optional<WorkoutPlan> plan = workoutPlanService.getWorkoutPlanById(id);
        return plan.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/week/{week}")
    public ResponseEntity<List<WorkoutPlan>> getWorkoutPlansByWeek(@PathVariable Integer week) {
        List<WorkoutPlan> plans = workoutPlanService.getWorkoutPlansByWeek(week);
        return ResponseEntity.ok(plans);
    }

    @PostMapping
    public ResponseEntity<WorkoutPlan> createWorkoutPlan(@Valid @RequestBody WorkoutPlan workoutPlan) {
        try {
            WorkoutPlan createdPlan = workoutPlanService.createWorkoutPlan(workoutPlan);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutPlan> updateWorkoutPlan(@PathVariable String id, @Valid @RequestBody WorkoutPlan workoutPlan) {
        try {
            Optional<WorkoutPlan> updatedPlan = workoutPlanService.updateWorkoutPlan(id, workoutPlan);
            return updatedPlan.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkoutPlan(@PathVariable String id) {
        boolean deleted = workoutPlanService.deleteWorkoutPlan(id);
        return deleted ? ResponseEntity.noContent().build() 
                       : ResponseEntity.notFound().build();
    }
}
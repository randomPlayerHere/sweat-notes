package com.fittracker.service;

import com.fittracker.model.WorkoutPlan;
import com.fittracker.repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkoutPlanService {

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    public List<WorkoutPlan> getAllWorkoutPlans() {
        return workoutPlanRepository.findAllByOrderByDayOfWeekAsc();
    }

    public Optional<WorkoutPlan> getWorkoutPlanById(String id) {
        return workoutPlanRepository.findById(id);
    }

    public List<WorkoutPlan> getWorkoutPlansByWeek(Integer week) {
        return workoutPlanRepository.findByWeekOrderByDayOfWeekAsc(week);
    }

    public WorkoutPlan createWorkoutPlan(WorkoutPlan workoutPlan) {
        return workoutPlanRepository.save(workoutPlan);
    }

    public Optional<WorkoutPlan> updateWorkoutPlan(String id, WorkoutPlan workoutPlan) {
        return workoutPlanRepository.findById(id)
                .map(existingPlan -> {
                    existingPlan.setDayOfWeek(workoutPlan.getDayOfWeek());
                    existingPlan.setName(workoutPlan.getName());
                    existingPlan.setDuration(workoutPlan.getDuration());
                    existingPlan.setExerciseCount(workoutPlan.getExerciseCount());
                    existingPlan.setFocus(workoutPlan.getFocus());
                    existingPlan.setStatus(workoutPlan.getStatus());
                    existingPlan.setWeek(workoutPlan.getWeek());
                    return workoutPlanRepository.save(existingPlan);
                });
    }

    public boolean deleteWorkoutPlan(String id) {
        if (workoutPlanRepository.existsById(id)) {
            workoutPlanRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
package com.fittracker.service;

import com.fittracker.model.Workout;
import com.fittracker.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;
    
    @Autowired
    private UserStatsService userStatsService;

    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAllByOrderByDateDesc();
    }

    public Optional<Workout> getWorkoutById(String id) {
        return workoutRepository.findById(id);
    }

    public Workout createWorkout(Workout workout) {
        workout.setDate(LocalDateTime.now());
        Workout savedWorkout = workoutRepository.save(workout);
        
        // Update user stats when a new workout is created
        userStatsService.updateStatsAfterWorkout();
        
        return savedWorkout;
    }

    public Optional<Workout> updateWorkout(String id, Workout workout) {
        return workoutRepository.findById(id)
                .map(existingWorkout -> {
                    existingWorkout.setName(workout.getName());
                    existingWorkout.setType(workout.getType());
                    existingWorkout.setDuration(workout.getDuration());
                    existingWorkout.setIntensity(workout.getIntensity());
                    existingWorkout.setCalories(workout.getCalories());
                    existingWorkout.setNotes(workout.getNotes());
                    return workoutRepository.save(existingWorkout);
                });
    }

    public boolean deleteWorkout(String id) {
        if (workoutRepository.existsById(id)) {
            workoutRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Workout> getWorkoutsAfterDate(LocalDateTime date) {
        return workoutRepository.findWorkoutsAfterDate(date);
    }

    public Long countWorkoutsAfterDate(LocalDateTime date) {
        return workoutRepository.countWorkoutsAfterDate(date);
    }

    public Long sumCaloriesAfterDate(LocalDateTime date) {
        return workoutRepository.sumCaloriesAfterDate(date);
    }
}
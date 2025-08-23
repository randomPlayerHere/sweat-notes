package com.fittracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_stats")
public class UserStats {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Min(value = 0, message = "Current streak cannot be negative")
    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak = 0;
    
    @Min(value = 0, message = "Best streak cannot be negative")
    @Column(name = "best_streak", nullable = false)
    private Integer bestStreak = 0;
    
    @Min(value = 0, message = "Total workouts cannot be negative")
    @Column(name = "total_workouts", nullable = false)
    private Integer totalWorkouts = 0;
    
    @Column(name = "last_workout_date")
    private LocalDateTime lastWorkoutDate;

    // Constructors
    public UserStats() {}

    public UserStats(Integer currentStreak, Integer bestStreak, Integer totalWorkouts, LocalDateTime lastWorkoutDate) {
        this.currentStreak = currentStreak;
        this.bestStreak = bestStreak;
        this.totalWorkouts = totalWorkouts;
        this.lastWorkoutDate = lastWorkoutDate;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Integer getBestStreak() {
        return bestStreak;
    }

    public void setBestStreak(Integer bestStreak) {
        this.bestStreak = bestStreak;
    }

    public Integer getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(Integer totalWorkouts) {
        this.totalWorkouts = totalWorkouts;
    }

    public LocalDateTime getLastWorkoutDate() {
        return lastWorkoutDate;
    }

    public void setLastWorkoutDate(LocalDateTime lastWorkoutDate) {
        this.lastWorkoutDate = lastWorkoutDate;
    }
}
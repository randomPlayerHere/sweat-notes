package com.fittracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.util.List;

@Entity
@Table(name = "workout_plans")
public class WorkoutPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotNull(message = "Day of week is required")
    @Min(value = 0, message = "Day of week must be between 0 (Sunday) and 6 (Saturday)")
    @Max(value = 6, message = "Day of week must be between 0 (Sunday) and 6 (Saturday)")
    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;
    
    @NotBlank(message = "Plan name is required")
    @Column(nullable = false)
    private String name;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Column(nullable = false)
    private Integer duration;
    
    @NotNull(message = "Exercise count is required")
    @Min(value = 0, message = "Exercise count cannot be negative")
    @Column(name = "exercise_count", nullable = false)
    private Integer exerciseCount;
    
    @ElementCollection
    @CollectionTable(name = "workout_plan_focus", joinColumns = @JoinColumn(name = "workout_plan_id"))
    @Column(name = "focus_area")
    private List<String> focus;
    
    @NotBlank(message = "Status is required")
    @Column(nullable = false)
    private String status = "upcoming";
    
    @NotNull(message = "Week is required")
    @Min(value = 1, message = "Week must be at least 1")
    @Column(nullable = false)
    private Integer week = 1;

    // Constructors
    public WorkoutPlan() {}

    public WorkoutPlan(Integer dayOfWeek, String name, Integer duration, Integer exerciseCount, 
                      List<String> focus, String status, Integer week) {
        this.dayOfWeek = dayOfWeek;
        this.name = name;
        this.duration = duration;
        this.exerciseCount = exerciseCount;
        this.focus = focus;
        this.status = status;
        this.week = week;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getExerciseCount() {
        return exerciseCount;
    }

    public void setExerciseCount(Integer exerciseCount) {
        this.exerciseCount = exerciseCount;
    }

    public List<String> getFocus() {
        return focus;
    }

    public void setFocus(List<String> focus) {
        this.focus = focus;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getWeek() {
        return week;
    }

    public void setWeek(Integer week) {
        this.week = week;
    }
}
package com.fittracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;

@Entity
@Table(name = "workouts")
public class Workout {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Workout name is required")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Workout type is required")
    @Column(nullable = false)
    private String type;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Column(nullable = false)
    private Integer duration;
    
    @NotNull(message = "Intensity is required")
    @Min(value = 1, message = "Intensity must be between 1 and 10")
    @Max(value = 10, message = "Intensity must be between 1 and 10")
    @Column(nullable = false)
    private Integer intensity;
    
    @NotNull(message = "Calories are required")
    @Min(value = 1, message = "Calories must be at least 1")
    @Column(nullable = false)
    private Integer calories;
    
    @Column(name = "created_at")
    private LocalDateTime date;
    
    @Column(columnDefinition = "TEXT")
    private String notes;

    // Constructors
    public Workout() {
        this.date = LocalDateTime.now();
    }

    public Workout(String name, String type, Integer duration, Integer intensity, Integer calories, String notes) {
        this();
        this.name = name;
        this.type = type;
        this.duration = duration;
        this.intensity = intensity;
        this.calories = calories;
        this.notes = notes;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getIntensity() {
        return intensity;
    }

    public void setIntensity(Integer intensity) {
        this.intensity = intensity;
    }

    public Integer getCalories() {
        return calories;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
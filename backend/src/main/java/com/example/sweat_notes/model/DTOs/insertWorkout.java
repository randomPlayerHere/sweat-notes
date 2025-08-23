package com.example.sweat_notes.model.DTOs;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class insertWorkout {
    
    @NotBlank(message = "Name cannot be blanked")
    private String name;

    @NotNull(message = "Type is Required")
    @Pattern(regexp = "strength|cardio|flexibility|sports|other")
    private String type;

    @NotNull(message = "Duration is Required")
    @Min(value = 1, message = "Duration should be at least 1 minute")
    @Max(value = 600, message="Duration cannot be more than 600 minutes")
    private Integer duration;
    
    @NotNull(message = "Intensity is Required")
    @Min(value = 1, message = "Intensity must be between 1 and 10")
    @Max(value = 10, message = "Intensity must be between 1 and 10")
    private Integer intensity;

    private String notes;

    //getters and setters
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
    
}

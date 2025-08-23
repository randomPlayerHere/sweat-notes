package com.example.sweat_notes.model;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class workoutPlanEntity {

    public workoutPlanEntity(String id, Integer dayofweek, String name, Integer duration, Integer exerciseCount,
            String status, Integer week, List<String> focus) {
        this.id = id;
        this.dayofweek = dayofweek;
        this.name = name;
        this.duration = duration;
        this.exerciseCount = exerciseCount;
        this.status = status;
        this.week = week;
        this.focus = focus;
    }

    @Id
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false)
    private Integer dayofweek;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false)
    private Integer exerciseCount;

    @Column(nullable = false)
    private String status = "Completed";

    @Column(nullable = false)
    private Integer week;

    @ElementCollection
    @CollectionTable(name = "workout_plan_focus")
    private List<String> focus;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getDayofweek() {
        return dayofweek;
    }

    public void setDayofweek(Integer dayofweek) {
        this.dayofweek = dayofweek;
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

    public List<String> getFocus() {
        return focus;
    }

    public void setFocus(List<String> focus) {
        this.focus = focus;
    }

}

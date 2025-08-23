package com.example.sweat_notes.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class userStatsEntity {
    @Id
    private String id = UUID.randomUUID().toString(); 
    
    @Column(nullable = false)
    private Integer currentStreak = 0;
    @Column(nullable = false)
    private Integer bestStreak = 0;

     @Column(nullable = false)
    private Integer totalWorkouts = 0;

      @Column(nullable = false)
    private LocalDateTime lastWorkoutDate;

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

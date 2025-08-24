package com.example.sweat_notes.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;

@Entity
public class userStatsEntity {
    @Id
    private String userid; 

    @OneToOne
    @MapsId
    @JoinColumn(name = "userid")
    private userEntity user;
    @Column(nullable = false)
    private Integer currentStreak = 0;

    @Column(nullable = false)
    private Integer bestStreak = 0;

     @Column(nullable = false)
    private Integer totalWorkouts = 0;

      @Column(nullable = false)
    private LocalDateTime lastWorkoutDate;

      public String getUserid() {
        return userid;
      }

      public void setUserid(String userid) {
        this.userid = userid;
      }

      public userEntity getUser() {
        return user;
      }

      public void setUser(userEntity user) {
        this.user = user;
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

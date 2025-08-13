package com.example.sweat_notes.services;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.sweat_notes.model.userStatsEntity;
import com.example.sweat_notes.repository.userStatRepository;


@Service
public class userStatService {
    
    @Autowired
    private userStatRepository userstatrepository; 
    
    public userStatsEntity getUserstats(){
        return userstatrepository.findFirstBy().orElseGet(() -> createInitialStats());

    }
  private userStatsEntity createInitialStats() {
        userStatsEntity stats = new userStatsEntity();
        stats.setCurrentStreak(12);
        stats.setBestStreak(18);
        stats.setTotalWorkouts(147);
        stats.setLastWorkoutDate(LocalDateTime.now());
        return userstatrepository.save(stats);
    }
    @SuppressWarnings("unused")
    private void updateStatsAfterWorkout(){
        userStatsEntity stats = new userStatsEntity();
        stats.setTotalWorkouts(stats.getTotalWorkouts()+1);
        stats.setLastWorkoutDate(LocalDateTime.now());
        userstatrepository.save(stats);
    }
    @SuppressWarnings("unused")
    private void updateStreak(userStatsEntity stats){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastWorkout = stats.getLastWorkoutDate();
        if (lastWorkout == null) {
            stats.setCurrentStreak(1);
        }
        long daydiff = Duration.between(lastWorkout.toLocalDate().atStartOfDay(), now.toLocalDate().atStartOfDay()).toDays();
        if(daydiff > 1){
            stats.setCurrentStreak(1);
        }
        else if(daydiff == 1){
            //consecutive days
            stats.setCurrentStreak(stats.getCurrentStreak()+1);
            if(stats.getCurrentStreak() > stats.getBestStreak()){
                stats.setBestStreak(stats.getCurrentStreak());
            }
        }
    }
  
}

package com.fittracker.service;

import com.fittracker.model.UserStats;
import com.fittracker.repository.UserStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class UserStatsService {

    @Autowired
    private UserStatsRepository userStatsRepository;

    @Autowired
    private WorkoutService workoutService;

    public UserStats getUserStats() {
        List<UserStats> statsList = userStatsRepository.findAll();
        if (statsList.isEmpty()) {
            // Create default stats if none exist
            UserStats defaultStats = new UserStats();
            return userStatsRepository.save(defaultStats);
        }
        return statsList.get(0); // Return the first (and presumably only) stats record
    }

    public UserStats updateUserStats(UserStats userStats) {
        UserStats existingStats = getUserStats();
        existingStats.setCurrentStreak(userStats.getCurrentStreak());
        existingStats.setBestStreak(userStats.getBestStreak());
        existingStats.setTotalWorkouts(userStats.getTotalWorkouts());
        existingStats.setLastWorkoutDate(userStats.getLastWorkoutDate());
        return userStatsRepository.save(existingStats);
    }

    public void updateStatsAfterWorkout() {
        UserStats stats = getUserStats();
        
        // Increment total workouts
        stats.setTotalWorkouts(stats.getTotalWorkouts() + 1);
        
        // Update streak logic
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime lastWorkout = stats.getLastWorkoutDate();
        
        if (lastWorkout == null) {
            // First workout ever
            stats.setCurrentStreak(1);
            stats.setBestStreak(1);
        } else {
            long daysBetween = ChronoUnit.DAYS.between(lastWorkout.toLocalDate(), today.toLocalDate());
            
            if (daysBetween == 0) {
                // Same day, don't change streak
            } else if (daysBetween == 1) {
                // Consecutive day
                stats.setCurrentStreak(stats.getCurrentStreak() + 1);
                if (stats.getCurrentStreak() > stats.getBestStreak()) {
                    stats.setBestStreak(stats.getCurrentStreak());
                }
            } else {
                // Streak broken
                stats.setCurrentStreak(1);
            }
        }
        
        stats.setLastWorkoutDate(today);
        userStatsRepository.save(stats);
    }
}
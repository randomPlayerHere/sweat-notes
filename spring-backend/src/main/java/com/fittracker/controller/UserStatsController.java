package com.fittracker.controller;

import com.fittracker.model.UserStats;
import com.fittracker.service.UserStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-stats")
@CrossOrigin(origins = "*")
public class UserStatsController {

    @Autowired
    private UserStatsService userStatsService;

    @GetMapping
    public ResponseEntity<UserStats> getUserStats() {
        UserStats stats = userStatsService.getUserStats();
        return ResponseEntity.ok(stats);
    }

    @PutMapping
    public ResponseEntity<UserStats> updateUserStats(@RequestBody UserStats userStats) {
        try {
            UserStats updatedStats = userStatsService.updateUserStats(userStats);
            return ResponseEntity.ok(updatedStats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
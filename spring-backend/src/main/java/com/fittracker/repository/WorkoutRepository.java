package com.fittracker.repository;

import com.fittracker.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, String> {
    
    List<Workout> findAllByOrderByDateDesc();
    
    @Query("SELECT w FROM Workout w WHERE w.date >= ?1 ORDER BY w.date DESC")
    List<Workout> findWorkoutsAfterDate(LocalDateTime date);
    
    @Query("SELECT COUNT(w) FROM Workout w WHERE w.date >= ?1")
    Long countWorkoutsAfterDate(LocalDateTime date);
    
    @Query("SELECT SUM(w.calories) FROM Workout w WHERE w.date >= ?1")
    Long sumCaloriesAfterDate(LocalDateTime date);
}
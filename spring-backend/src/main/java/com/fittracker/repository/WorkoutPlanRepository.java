package com.fittracker.repository;

import com.fittracker.model.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, String> {
    
    List<WorkoutPlan> findAllByOrderByDayOfWeekAsc();
    
    List<WorkoutPlan> findByWeekOrderByDayOfWeekAsc(Integer week);
    
    List<WorkoutPlan> findByStatus(String status);
}
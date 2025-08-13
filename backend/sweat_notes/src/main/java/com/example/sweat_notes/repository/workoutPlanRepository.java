package com.example.sweat_notes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sweat_notes.model.workoutPlanEntity;

@Repository
public interface workoutPlanRepository extends JpaRepository<workoutPlanEntity,String> {
    List<workoutPlanEntity>findAllByOrderByDayofweekAsc();  
}
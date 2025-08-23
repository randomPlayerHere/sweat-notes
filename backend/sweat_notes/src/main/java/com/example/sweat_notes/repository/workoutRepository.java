package com.example.sweat_notes.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sweat_notes.model.workoutEntity;

@Repository
public interface workoutRepository extends JpaRepository<workoutEntity,String> {
    List<workoutEntity>findAllByOrderByDateDesc();
}

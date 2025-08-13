package com.example.sweat_notes.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sweat_notes.model.workoutEntity;
import com.example.sweat_notes.model.DTOs.insertWorkout;
import com.example.sweat_notes.services.workoutService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "http://localhost:5000",allowCredentials = "true")
public class workoutController {
    @Autowired
    private workoutService workoutservice;
    
    @GetMapping
    public ResponseEntity<List<workoutEntity>> getAllWorkout() {
        try{
            List<workoutEntity> workouts = workoutservice.getAllWorkouts();
            return ResponseEntity.ok(workouts);
        }
        catch(Exception e){
            return ResponseEntity.status(500).build();
        }
    }
    @PostMapping
    public ResponseEntity<?> createWorkout(@Valid @RequestBody insertWorkout insertworkout) {
        try{
            workoutEntity workout =  workoutservice.createworkout(insertworkout);
            return ResponseEntity.status(201).body(workout);
        }
        catch(Exception e){
           return ResponseEntity.status(500).body(Map.of("message","failed to create workout"));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkout(@PathVariable String id){
        try{
            boolean deleted = workoutservice.deleteWorkout(id);
            if(deleted){
                return ResponseEntity.status(204).build();
            }
            else{
                return ResponseEntity.status(404).body(Map.of("message","Workout not Found!"));
            }
        }
        catch(Exception e){
            return ResponseEntity.status(500).body(Map.of("message","Failed to delete Workout","error",e.getMessage()));
        }

    }
    
    
    
}

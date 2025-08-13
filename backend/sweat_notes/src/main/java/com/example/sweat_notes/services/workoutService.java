package com.example.sweat_notes.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.sweat_notes.model.workoutEntity;
import com.example.sweat_notes.model.DTOs.insertWorkout;
import com.example.sweat_notes.repository.workoutRepository;


@Service
public class workoutService {

    @Autowired
    private workoutRepository workoutrepository;
    
    public List<workoutEntity> getAllWorkouts(){
        return workoutrepository.findAllByOrderByDateDesc();
    }
    
    public workoutEntity createworkout(insertWorkout insertworkout){
        workoutEntity workout = new workoutEntity();
        workout.setName(insertworkout.getName());
        workout.setType(insertworkout.getType());
        workout.setDuration(insertworkout.getDuration());
        workout.setIntensity(insertworkout.getIntensity());
        workout.setNotes(insertworkout.getNotes());
       
        workoutEntity saved = workoutrepository.save(workout);
        return saved;
    }
    public boolean deleteWorkout(String id){
        if (workoutrepository.existsById(id)) {
            workoutrepository.deleteById(id);
            return true;
       } 
       else{
           return false;
       }
    }
    
    
}

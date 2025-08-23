package com.example.sweat_notes.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sweat_notes.model.userStatsEntity;

public interface userStatRepository extends JpaRepository<userStatsEntity,String>{
    Optional<userStatsEntity>findFirstBy();
}
package com.example.sweat_notes.repository;

import com.example.sweat_notes.model.userEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<userEntity, String> {
    Optional<userEntity> findByUsername(String username);
    Optional<userEntity> findByMail(String mail);
    boolean existsByMail(String mail);
}
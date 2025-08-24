package com.example.sweat_notes.services;

import com.example.sweat_notes.model.userEntity;
import com.example.sweat_notes.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<userEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<userEntity> findByEmail(String email) {
        return userRepository.findByMail(email);
    }

    public userEntity saveUser(userEntity user) {
        return userRepository.save(user);
    }

    public Map<String, Object> getUserProfile(String userId) {
        // Find the user in the database using the user ID
        Optional<userEntity> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        userEntity user = userOpt.get();

        // Build and return the user profile map
        return Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "mail", user.getMail()
        );
    }
}
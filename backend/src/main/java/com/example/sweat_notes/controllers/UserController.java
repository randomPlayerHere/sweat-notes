package com.example.sweat_notes.controllers;

import com.example.sweat_notes.model.userEntity;
import com.example.sweat_notes.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable String userId) {
        Map<String, Object> userProfile = userService.getUserProfile(userId);
        return ResponseEntity.ok(userProfile);
    }

    @GetMapping
    public ResponseEntity<List<userEntity>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping(params = "mail")
    public ResponseEntity<userEntity> getUserByEmail(@RequestParam String mail) {
        Optional<userEntity> user = userService.findByEmail(mail);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<userEntity> createUser(@RequestBody userEntity user) {
        try {
            // Check if user with this email already exists
            if (userService.findByEmail(user.getMail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            
            userEntity savedUser = userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
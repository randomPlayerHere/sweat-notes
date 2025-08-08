# Spring Boot Quick Start Checklist

Use this checklist to quickly implement your Spring Boot backend for HyprFit.

## 1. Project Setup

### Create Spring Boot Project
```bash
# Using Spring Initializr (https://start.spring.io/)
# Dependencies needed:
- Spring Web
- Spring Data JPA  
- PostgreSQL Driver
- Validation
```

### Add CORS Configuration
```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 2. Create Entities

### Workout Entity
```java
@Entity
@Table(name = "workouts")
public class Workout {
    @Id
    private String id = UUID.randomUUID().toString();
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false)
    private Integer duration;
    
    @Column(nullable = false)
    private Integer intensity;
    
    @Column(nullable = false)
    private LocalDateTime date = LocalDateTime.now();
    
    private String notes;
    
    // constructors, getters, setters
}
```

### WorkoutPlan Entity  
```java
@Entity
@Table(name = "workout_plans")
public class WorkoutPlan {
    @Id
    private String id = UUID.randomUUID().toString();
    
    @Column(nullable = false)
    private Integer dayOfWeek;
    
    @Column(nullable = false) 
    private String name;
    
    @Column(nullable = false)
    private Integer duration;
    
    @Column(nullable = false)
    private Integer exerciseCount;
    
    @ElementCollection
    @CollectionTable(name = "workout_plan_focus")
    private List<String> focus;
    
    @Column(nullable = false)
    private String status = "upcoming";
    
    @Column(nullable = false)
    private Integer week = 1;
    
    // constructors, getters, setters
}
```

### UserStats Entity
```java
@Entity
@Table(name = "user_stats") 
public class UserStats {
    @Id
    private String id = UUID.randomUUID().toString();
    
    @Column(nullable = false)
    private Integer currentStreak = 0;
    
    @Column(nullable = false)
    private Integer bestStreak = 0;
    
    @Column(nullable = false)
    private Integer totalWorkouts = 0;
    
    private LocalDateTime lastWorkoutDate;
    
    // constructors, getters, setters
}
```

## 3. Create DTOs

### InsertWorkout DTO
```java
public class InsertWorkout {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotNull(message = "Type is required")
    @Pattern(regexp = "strength|cardio|flexibility|sports|other", 
             message = "Type must be one of: strength, cardio, flexibility, sports, other")
    private String type;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 600, message = "Duration must be less than 600 minutes")
    private Integer duration;
    
    @NotNull(message = "Intensity is required")
    @Min(value = 1, message = "Intensity must be between 1 and 10")
    @Max(value = 10, message = "Intensity must be between 1 and 10")
    private Integer intensity;
    
    private String notes;
    
    // getters, setters
}
```

## 4. Create Repositories

```java
@Repository
public interface WorkoutRepository extends JpaRepository<Workout, String> {
    List<Workout> findAllByOrderByDateDesc();
}

@Repository  
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, String> {
    List<WorkoutPlan> findAllByOrderByDayOfWeekAsc();
}

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, String> {
    // Single user app - you might want to return the first/only record
    Optional<UserStats> findFirstBy();
}
```

## 5. Create Services

### WorkoutService
```java
@Service
public class WorkoutService {
    @Autowired
    private WorkoutRepository workoutRepository;
    
    @Autowired
    private UserStatsService userStatsService;
    
    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAllByOrderByDateDesc();
    }
    
    public Workout createWorkout(InsertWorkout insertWorkout) {
        Workout workout = new Workout();
        workout.setName(insertWorkout.getName());
        workout.setType(insertWorkout.getType());
        workout.setDuration(insertWorkout.getDuration());
        workout.setIntensity(insertWorkout.getIntensity());
        workout.setNotes(insertWorkout.getNotes());
        
        Workout saved = workoutRepository.save(workout);
        
        // Update user stats after creating workout
        userStatsService.updateStatsAfterWorkout();
        
        return saved;
    }
    
    public boolean deleteWorkout(String id) {
        if (workoutRepository.existsById(id)) {
            workoutRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
```

### UserStatsService
```java
@Service
public class UserStatsService {
    @Autowired
    private UserStatsRepository userStatsRepository;
    
    public UserStats getUserStats() {
        return userStatsRepository.findFirstBy()
                .orElseGet(() -> createInitialStats());
    }
    
    private UserStats createInitialStats() {
        UserStats stats = new UserStats();
        stats.setCurrentStreak(12);
        stats.setBestStreak(18);
        stats.setTotalWorkouts(147);
        stats.setLastWorkoutDate(LocalDateTime.now());
        return userStatsRepository.save(stats);
    }
    
    public void updateStatsAfterWorkout() {
        UserStats stats = getUserStats();
        stats.setTotalWorkouts(stats.getTotalWorkouts() + 1);
        updateStreak(stats);
        stats.setLastWorkoutDate(LocalDateTime.now());
        userStatsRepository.save(stats);
    }
    
    private void updateStreak(UserStats stats) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastWorkout = stats.getLastWorkoutDate();
        
        if (lastWorkout == null) {
            stats.setCurrentStreak(1);
            return;
        }
        
        long daysDiff = Duration.between(lastWorkout.toLocalDate().atStartOfDay(), 
                                       now.toLocalDate().atStartOfDay()).toDays();
        
        if (daysDiff == 1) {
            // Consecutive day
            stats.setCurrentStreak(stats.getCurrentStreak() + 1);
            if (stats.getCurrentStreak() > stats.getBestStreak()) {
                stats.setBestStreak(stats.getCurrentStreak());
            }
        } else if (daysDiff > 1) {
            // Streak broken  
            stats.setCurrentStreak(1);
        }
        // If daysDiff == 0, same day - don't change streak
    }
}
```

## 6. Create Controllers

### WorkoutController
```java
@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "http://localhost:5000", allowCredentials = true)
public class WorkoutController {
    @Autowired
    private WorkoutService workoutService;
    
    @GetMapping
    public ResponseEntity<List<Workout>> getAllWorkouts() {
        try {
            List<Workout> workouts = workoutService.getAllWorkouts();
            return ResponseEntity.ok(workouts);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createWorkout(@Valid @RequestBody InsertWorkout insertWorkout) {
        try {
            Workout workout = workoutService.createWorkout(insertWorkout);
            return ResponseEntity.status(201).body(workout);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to create workout"));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkout(@PathVariable String id) {
        try {
            boolean deleted = workoutService.deleteWorkout(id);
            if (deleted) {
                return ResponseEntity.status(204).build();
            } else {
                return ResponseEntity.status(404)
                        .body(Map.of("message", "Workout not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to delete workout"));
        }
    }
}
```

## 7. Application Properties

```yaml
server:
  port: 5000

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/hyprfit
    username: your_username
    password: your_password
    driver-class-name: org.postgresql.Driver
    
  jpa:
    hibernate:
      ddl-auto: create-drop  # Use 'update' for production
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

## 8. Test Your Implementation

1. **Start your Spring Boot app** on port 5000
2. **Keep the React frontend running** (it should automatically connect)
3. **Test in the browser**:
   - Dashboard should load with data
   - Try logging a new workout
   - Check that stats update properly

## 9. Error Handling

Add a global exception handler:

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Invalid data");
        
        List<Map<String, String>> errors = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            Map<String, String> fieldError = new HashMap<>();
            fieldError.put("field", error.getField());
            fieldError.put("message", error.getDefaultMessage());
            errors.add(fieldError);
        });
        
        response.put("errors", errors);
        return ResponseEntity.status(400).body(response);
    }
}
```

That's it! Your Spring Boot backend should now work perfectly with the existing React frontend. The frontend will automatically connect and all features should work as expected.
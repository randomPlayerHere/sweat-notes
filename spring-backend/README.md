# Fitness Tracker Spring Boot Backend

This is a Spring Boot REST API backend for the Fitness Tracker application.

## Features

- RESTful API for workouts, workout plans, and user statistics
- PostgreSQL database integration
- Automatic database schema creation/updates
- CORS enabled for frontend integration
- Bean validation for input validation
- Comprehensive error handling

## API Endpoints

### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/{id}` - Get workout by ID
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/{id}` - Update workout
- `DELETE /api/workouts/{id}` - Delete workout

### Workout Plans
- `GET /api/workout-plans` - Get all workout plans
- `GET /api/workout-plans/{id}` - Get workout plan by ID
- `GET /api/workout-plans/week/{week}` - Get workout plans by week
- `POST /api/workout-plans` - Create new workout plan
- `PUT /api/workout-plans/{id}` - Update workout plan
- `DELETE /api/workout-plans/{id}` - Delete workout plan

### User Statistics
- `GET /api/user-stats` - Get user statistics
- `PUT /api/user-stats` - Update user statistics

## Running the Application

1. Make sure PostgreSQL is running
2. Set environment variables or update application.properties:
   - `DATABASE_URL`
   - `PGUSER`
   - `PGPASSWORD`

3. Run with Maven:
```bash
./mvnw spring-boot:run
```

4. The API will be available at `http://localhost:8080`

## Database

The application uses PostgreSQL and automatically creates/updates the database schema on startup. The following tables are created:
- `workouts` - Stores workout records
- `workout_plans` - Stores workout plans
- `workout_plan_focus` - Stores focus areas for workout plans
- `user_stats` - Stores user statistics

## CORS

CORS is enabled to allow requests from the frontend application running on different ports/domains.
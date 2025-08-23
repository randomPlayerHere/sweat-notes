# Flask API Integration Guide for FitTracker

This guide explains how to integrate your Flask ML models and RAG system with the FitTracker application.

## Overview

The FitTracker app is now prepared for two Flask API integrations:
1. **Calorie Prediction ML Model** - For the Log Workout section
2. **Workout Recommendation RAG System** - For the Plans section

## Frontend Integration Points

### 1. Log Workout Page (`client/src/pages/log-workout.tsx`)

**What Changed:**
- Removed the manual calories input field
- Added AI calorie prediction functionality
- Added "Predict Calories" button that calls your Flask ML API

**Flask API Expected:**
- **Endpoint:** `http://localhost:5001/predict-calories`
- **Method:** POST
- **Request Body:**
```json
{
  "workout_type": "cardio",
  "duration": 30,
  "intensity": 7,
  "workout_name": "Morning Run"
}
```
- **Response:**
```json
{
  "predicted_calories": 285,
  "confidence": 0.87,
  "model_version": "v1.2"
}
```

**How It Works:**
1. User fills in workout details (name, type, duration, intensity)
2. User clicks "Predict Calories" button
3. Frontend calls your Flask ML API with workout data
4. API returns predicted calories
5. User can then log the workout with predicted calories

**Fallback Logic:**
If your Flask API is unavailable, the app uses a simple calculation:
```javascript
baseRate * duration * (intensity / 5)
```

### 2. Plans Page (`client/src/pages/plans.tsx`)

**What Changed:**
- Added AI workout recommendations functionality
- Added "AI Recommendations" button
- Integrated with your Flask RAG API for personalized workout plans

**Flask API Expected:**
- **Endpoint:** `http://localhost:5002/generate-workout-plan`
- **Method:** POST
- **Request Body:**
```json
{
  "fitness_level": "intermediate",
  "goals": ["strength", "endurance"],
  "available_days": 4,
  "workout_duration": 45,
  "equipment": ["bodyweight", "dumbbells"]
}
```
- **Response:**
```json
{
  "recommended_plans": [
    {
      "name": "Upper Body Strength",
      "dayOfWeek": 1,
      "duration": 45,
      "exerciseCount": 8,
      "focus": ["strength", "upper_body"],
      "status": "upcoming",
      "week": 1
    },
    {
      "name": "Cardio Blast",
      "dayOfWeek": 3,
      "duration": 30,
      "exerciseCount": 6,
      "focus": ["cardio", "endurance"],
      "status": "upcoming",
      "week": 1
    }
  ],
  "reasoning": "Based on your fitness level and goals...",
  "estimated_calories_per_week": 1200
}
```

## Code Structure

### Frontend Files Modified:
- `client/src/pages/log-workout.tsx` - Calorie prediction integration
- `client/src/pages/plans.tsx` - Workout recommendations integration
- `client/src/components/dashboard/navigation.tsx` - Updated navigation
- `client/src/App.tsx` - Added new routes

### Backend Files (Spring Boot):
- Complete REST API in `spring-backend/` directory
- Models: `Workout.java`, `WorkoutPlan.java`, `UserStats.java`
- Controllers: `WorkoutController.java`, etc.
- PostgreSQL integration ready

### Database Schema:
- `workouts` table - stores workout records with predicted calories
- `workout_plans` table - stores AI-generated and manual workout plans
- `user_stats` table - tracks user progress and streaks

## Flask APIs to Implement

### 1. Calorie Prediction API (`http://localhost:5001`)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib  # or your ML framework

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Load your trained model
model = joblib.load('calorie_prediction_model.pkl')

@app.route('/predict-calories', methods=['POST'])
def predict_calories():
    data = request.get_json()
    
    # Extract features
    workout_type = data.get('workout_type')
    duration = data.get('duration')
    intensity = data.get('intensity') 
    workout_name = data.get('workout_name')
    
    # Your ML prediction logic here
    predicted_calories = model.predict([[
        encode_workout_type(workout_type),
        duration,
        intensity
    ]])[0]
    
    return jsonify({
        'predicted_calories': int(predicted_calories),
        'confidence': 0.85,  # your model's confidence score
        'model_version': 'v1.0'
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
```

### 2. Workout Recommendation API (`http://localhost:5002`)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
# Your RAG and LLM imports here

app = Flask(__name__)
CORS(app)

@app.route('/generate-workout-plan', methods=['POST'])
def generate_workout_plan():
    data = request.get_json()
    
    # Extract user preferences
    fitness_level = data.get('fitness_level')
    goals = data.get('goals')
    available_days = data.get('available_days')
    workout_duration = data.get('workout_duration')
    equipment = data.get('equipment')
    
    # Your RAG + LLM logic here
    # Query your knowledge base and generate personalized recommendations
    
    recommended_plans = generate_personalized_plans(
        fitness_level, goals, available_days, 
        workout_duration, equipment
    )
    
    return jsonify({
        'recommended_plans': recommended_plans,
        'reasoning': 'Generated based on your fitness level and goals',
        'estimated_calories_per_week': calculate_weekly_calories(recommended_plans)
    })

if __name__ == '__main__':
    app.run(port=5002, debug=True)
```

## Testing Your Integration

### 1. Test Calorie Prediction:
1. Start your Flask calorie prediction API on port 5001
2. Go to Log Workout page
3. Fill in workout details
4. Click "Predict Calories"
5. Verify the predicted value appears

### 2. Test Workout Recommendations:
1. Start your Flask RAG API on port 5002  
2. Go to Plans page
3. Click "AI Recommendations"
4. Verify personalized workout plans appear

## Error Handling

Both integrations have fallback mechanisms:
- **Calorie Prediction:** Uses simple calculation if API fails
- **Workout Recommendations:** Shows static example plans if API fails

## CORS Configuration

Make sure your Flask APIs have CORS enabled:
```python
from flask_cors import CORS
CORS(app)  # Allow all origins, or specify frontend URL
```

## Environment Variables

You may want to make API URLs configurable:
```javascript
const CALORIE_API_URL = process.env.VITE_CALORIE_API_URL || 'http://localhost:5001';
const WORKOUT_API_URL = process.env.VITE_WORKOUT_API_URL || 'http://localhost:5002';
```

## Next Steps

1. Implement your Flask APIs using the specifications above
2. Test the integration with the frontend
3. Deploy your Flask services alongside the Node.js app
4. Configure proper authentication if needed
5. Add error monitoring and logging

## File Structure Summary

```
.
├── client/                    # React Frontend
│   ├── src/pages/
│   │   ├── log-workout.tsx   # Calorie prediction integration
│   │   ├── plans.tsx         # Workout recommendations
│   │   └── ...
├── server/                    # Node.js/Express API
├── spring-backend/           # Spring Boot API (alternative)
├── shared/                   # Shared types and schemas
└── FLASK_INTEGRATION_GUIDE.md # This file
```

The app is now fully prepared for your ML integrations!
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import pickle
import warnings
warnings.filterwarnings('ignore')

# Load the data
print("Loading data...")
df = pd.read_csv('paste.txt')  # Replace with your CSV file path

print(f"Dataset shape: {df.shape}")
print(f"Missing values: {df.isnull().sum().sum()}")

# Basic data exploration
print("\nBasic Info:")
print(df.info())

# Feature Engineering (Simple but effective)
print("\nPerforming feature engineering...")

# 1. Calculate BMI if not present
if 'BMI' not in df.columns:
    df['BMI'] = df['Weight (kg)'] / (df['Height (m)'] ** 2)

# 2. BMR calculation (Basal Metabolic Rate)
df['BMR'] = np.where(
    df['Gender'] == 'Male',
    10 * df['Weight (kg)'] + 6.25 * (df['Height (m)'] * 100) - 5 * df['Age'] + 5,
    10 * df['Weight (kg)'] + 6.25 * (df['Height (m)'] * 100) - 5 * df['Age'] - 161
)

# 3. Weight x Duration interaction (important for calorie burn)
df['Weight_Duration'] = df['Weight (kg)'] * df['Session_Duration (hours)']

# 4. BMI x Duration interaction
df['BMI_Duration'] = df['BMI'] * df['Session_Duration (hours)']

# 5. Workout intensity score
df['Workout_Intensity'] = df['Experience_Level'] * df['Workout_Frequency (days/week)']

# 6. Body fat categories
df['Fat_Category'] = pd.cut(df['Fat_Percentage'], 
                           bins=[0, 15, 25, 35, 100], 
                           labels=['Low', 'Normal', 'High', 'Very_High'])

print(f"Features after engineering: {df.shape[1]}")

# Prepare features (excluding BPM and water intake as requested)
exclude_cols = ['Max_BPM', 'Avg_BPM', 'Resting_BPM', 'Water_Intake (liters)', 'Calories_Burned']
feature_cols = [col for col in df.columns if col not in exclude_cols]

X = df[feature_cols].copy()
y = df['Calories_Burned'].copy()

# Handle categorical variables
categorical_cols = X.select_dtypes(include=['object']).columns
label_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    label_encoders[col] = le

print(f"Final feature set: {list(X.columns)}")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Hyperparameter tuning (simplified)
print("\nTraining Random Forest with hyperparameter tuning...")

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 15, 20],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2]
}

rf = RandomForestRegressor(random_state=42)
grid_search = GridSearchCV(rf, param_grid, cv=5, scoring='r2', n_jobs=-1)
grid_search.fit(X_train, y_train)

# Best model
best_model = grid_search.best_estimator_
print(f"Best parameters: {grid_search.best_params_}")

# Predictions
y_train_pred = best_model.predict(X_train)
y_test_pred = best_model.predict(X_test)

# Evaluation
train_r2 = r2_score(y_train, y_train_pred)
test_r2 = r2_score(y_test, y_test_pred)
train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
test_mae = mean_absolute_error(y_test, y_test_pred)

print("\n" + "="*40)
print("MODEL PERFORMANCE")
print("="*40)
print(f"Training R²: {train_r2:.4f}")
print(f"Testing R²: {test_r2:.4f}")
print(f"Testing RMSE: {test_rmse:.2f} calories")
print(f"Testing MAE: {test_mae:.2f} calories")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\nTop 5 Important Features:")
for i, row in feature_importance.head().iterrows():
    print(f"  {row['feature']}: {row['importance']:.4f}")

# Visualization
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Actual vs Predicted
axes[0].scatter(y_test, y_test_pred, alpha=0.6)
axes[0].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
axes[0].set_xlabel('Actual Calories')
axes[0].set_ylabel('Predicted Calories')
axes[0].set_title(f'Actual vs Predicted (R² = {test_r2:.3f})')

# Feature importance
top_features = feature_importance.head(8)
axes[1].barh(range(len(top_features)), top_features['importance'])
axes[1].set_yticks(range(len(top_features)))
axes[1].set_yticklabels(top_features['feature'])
axes[1].set_xlabel('Importance')
axes[1].set_title('Feature Importance')

# Residuals
residuals = y_test - y_test_pred
axes[2].scatter(y_test_pred, residuals, alpha=0.6)
axes[2].axhline(y=0, color='r', linestyle='--')
axes[2].set_xlabel('Predicted Calories')
axes[2].set_ylabel('Residuals')
axes[2].set_title('Residuals Plot')

plt.tight_layout()
plt.show()

# Save the model and encoders
model_data = {
    'model': best_model,
    'label_encoders': label_encoders,
    'feature_columns': list(X.columns),
    'model_performance': {
        'test_r2': test_r2,
        'test_rmse': test_rmse,
        'test_mae': test_mae
    }
}

# Export as pickle file
with open('calories_prediction_model.pkl', 'wb') as f:
    pickle.dump(model_data, f)

print(f"\n✅ Model saved as 'calories_prediction_model.pkl'")

# Example prediction function
def predict_calories(age, gender, weight, height, session_duration, workout_type, 
                    fat_percentage, workout_frequency, experience_level, model_data):
    """
    Make a prediction with the saved model
    """
    # Create input dataframe
    input_df = pd.DataFrame({
        'Age': [age],
        'Gender': [gender],
        'Weight (kg)': [weight],
        'Height (m)': [height],
        'Session_Duration (hours)': [session_duration],
        'Workout_Type': [workout_type],
        'Fat_Percentage': [fat_percentage],
        'Workout_Frequency (days/week)': [workout_frequency],
        'Experience_Level': [experience_level],
    })
    
    # Feature engineering (same as training)
    input_df['BMI'] = input_df['Weight (kg)'] / (input_df['Height (m)'] ** 2)
    input_df['BMR'] = np.where(
        input_df['Gender'] == 'Male',
        10 * input_df['Weight (kg)'] + 6.25 * (input_df['Height (m)'] * 100) - 5 * input_df['Age'] + 5,
        10 * input_df['Weight (kg)'] + 6.25 * (input_df['Height (m)'] * 100) - 5 * input_df['Age'] - 161
    )
    input_df['Weight_Duration'] = input_df['Weight (kg)'] * input_df['Session_Duration (hours)']
    input_df['BMI_Duration'] = input_df['BMI'] * input_df['Session_Duration (hours)']
    input_df['Workout_Intensity'] = input_df['Experience_Level'] * input_df['Workout_Frequency (days/week)']
    input_df['Fat_Category'] = pd.cut(input_df['Fat_Percentage'], 
                                     bins=[0, 15, 25, 35, 100], 
                                     labels=['Low', 'Normal', 'High', 'Very_High'])
    
    # Encode categorical variables
    for col, encoder in model_data['label_encoders'].items():
        if col in input_df.columns:
            input_df[col] = encoder.transform(input_df[col].astype(str))
    
    # Make prediction
    prediction = model_data['model'].predict(input_df[model_data['feature_columns']])[0]
    return prediction

# Test the prediction function
print("\n" + "="*40)
print("EXAMPLE PREDICTION")
print("="*40)

# Example: 30-year-old male, 75kg, 1.75m, 1.5 hours HIIT, 20% fat, 4 days/week, experience level 2
example_prediction = predict_calories(
    age=30, gender='Male', weight=75, height=1.75, 
    session_duration=1.5, workout_type='HIIT', 
    fat_percentage=20, workout_frequency=4, experience_level=2,
    model_data=model_data
)

print(f"Predicted calories burned: {example_prediction:.0f} calories")

print(f"\n🎉 Model ready! Use the pickle file for predictions in other scripts.")

# Quick load test
print("\nTesting model loading...")
with open('calories_prediction_model.pkl', 'rb') as f:
    loaded_model = pickle.load(f)
    
print(f"Model loaded successfully!")
print(f"Model performance: R² = {loaded_model['model_performance']['test_r2']:.4f}")

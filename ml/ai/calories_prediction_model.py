import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score, KFold
from sklearn.preprocessing import StandardScaler, LabelEncoder, PolynomialFeatures, PowerTransformer
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.feature_selection import SelectKBest, f_regression, RFE
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# Set style for better plots
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class CaloriesBurnedPredictor:
    def __init__(self, csv_path):
        """
        Initialize the predictor with data from CSV file
        """
        self.csv_path = "../data/gym_members_exercise_tracking.csv"
        self.df = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = []
        
    def load_and_explore_data(self):
        """
        Load data from CSV and perform initial exploration
        """
        print("Loading data from CSV...")
        self.df = pd.read_csv(self.csv_path)
        
        print(f"Dataset shape: {self.df.shape}")
        print(f"Missing values: {self.df.isnull().sum().sum()}")
        
        # Display basic info
        print("\nDataset Info:")
        print(self.df.info())
        
        print("\nFirst 5 rows:")
        print(self.df.head())
        
        print("\nBasic statistics:")
        print(self.df.describe())
        
        return self.df
    
    def visualize_data(self):
        """
        Create comprehensive visualizations of the data
        """
        fig, axes = plt.subplots(2, 3, figsize=(18, 12))
        
        # Distribution of target variable
        axes[0, 0].hist(self.df['Calories_Burned'], bins=30, alpha=0.7, color='skyblue')
        axes[0, 0].set_title('Distribution of Calories Burned')
        axes[0, 0].set_xlabel('Calories Burned')
        axes[0, 0].set_ylabel('Frequency')
        
        # Calories by Workout Type
        workout_calories = self.df.groupby('Workout_Type')['Calories_Burned'].mean()
        axes[0, 1].bar(workout_calories.index, workout_calories.values, color='lightcoral')
        axes[0, 1].set_title('Average Calories Burned by Workout Type')
        axes[0, 1].set_xlabel('Workout Type')
        axes[0, 1].set_ylabel('Average Calories Burned')
        axes[0, 1].tick_params(axis='x', rotation=45)
        
        # Calories by Gender
        gender_calories = self.df.groupby('Gender')['Calories_Burned'].mean()
        axes[0, 2].bar(gender_calories.index, gender_calories.values, color='lightgreen')
        axes[0, 2].set_title('Average Calories Burned by Gender')
        axes[0, 2].set_xlabel('Gender')
        axes[0, 2].set_ylabel('Average Calories Burned')
        
        # Weight vs Calories
        axes[1, 0].scatter(self.df['Weight (kg)'], self.df['Calories_Burned'], alpha=0.6, color='orange')
        axes[1, 0].set_title('Weight vs Calories Burned')
        axes[1, 0].set_xlabel('Weight (kg)')
        axes[1, 0].set_ylabel('Calories Burned')
        
        # Session Duration vs Calories
        axes[1, 1].scatter(self.df['Session_Duration (hours)'], self.df['Calories_Burned'], alpha=0.6, color='purple')
        axes[1, 1].set_title('Session Duration vs Calories Burned')
        axes[1, 1].set_xlabel('Session Duration (hours)')
        axes[1, 1].set_ylabel('Calories Burned')
        
        # Age vs Calories
        axes[1, 2].scatter(self.df['Age'], self.df['Calories_Burned'], alpha=0.6, color='brown')
        axes[1, 2].set_title('Age vs Calories Burned')
        axes[1, 2].set_xlabel('Age')
        axes[1, 2].set_ylabel('Calories Burned')
        
        plt.tight_layout()
        plt.show()
        
        # Correlation matrix
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        plt.figure(figsize=(12, 10))
        correlation_matrix = self.df[numeric_cols].corr()
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, 
                   square=True, linewidths=0.5)
        plt.title('Correlation Matrix of Numeric Features')
        plt.show()
    
    def advanced_feature_engineering(self):
        """
        Perform comprehensive feature engineering
        """
        print("Performing advanced feature engineering...")
        
        # Create a copy for feature engineering
        df_engineered = self.df.copy()
        
        # 1. BMR (Basal Metabolic Rate) calculation using Mifflin-St Jeor Equation
        df_engineered['BMR'] = np.where(
            df_engineered['Gender'] == 'Male',
            (10 * df_engineered['Weight (kg)']) + (6.25 * df_engineered['Height (m)'] * 100) - (5 * df_engineered['Age']) + 5,
            (10 * df_engineered['Weight (kg)']) + (6.25 * df_engineered['Height (m)'] * 100) - (5 * df_engineered['Age']) - 161
        )
        
        # 2. Body Surface Area (BSA) using DuBois formula
        df_engineered['BSA'] = 0.007184 * (df_engineered['Weight (kg)'] ** 0.425) * ((df_engineered['Height (m)'] * 100) ** 0.725)
        
        # 3. Activity Metabolic Equivalent (MET) based on workout type and intensity
        met_values = {
            'Yoga': 2.5,
            'Strength': 6.0,
            'Cardio': 8.0,
            'HIIT': 10.0
        }
        df_engineered['MET'] = df_engineered['Workout_Type'].map(met_values)
        
        # 4. Theoretical calories burned using MET formula
        df_engineered['Theoretical_Calories'] = df_engineered['MET'] * df_engineered['Weight (kg)'] * df_engineered['Session_Duration (hours)']
        
        # 5. Body composition features
        df_engineered['Lean_Body_Mass'] = df_engineered['Weight (kg)'] * (1 - df_engineered['Fat_Percentage'] / 100)
        df_engineered['Fat_Mass'] = df_engineered['Weight (kg)'] * (df_engineered['Fat_Percentage'] / 100)
        
        # 6. Age-based metabolic adjustments
        df_engineered['Age_Group'] = pd.cut(df_engineered['Age'], bins=[0, 25, 35, 45, 55, 100], 
                                          labels=['Young', 'Adult', 'Middle', 'Mature', 'Senior'])
        
        # 7. BMI categories
        df_engineered['BMI_Category'] = pd.cut(df_engineered['BMI'], 
                                             bins=[0, 18.5, 25, 30, 100],
                                             labels=['Underweight', 'Normal', 'Overweight', 'Obese'])
        
        # 8. Workout intensity based on experience and frequency
        df_engineered['Workout_Intensity'] = (df_engineered['Experience_Level'] * df_engineered['Workout_Frequency (days/week)']) / 7
        
        # 9. Metabolic efficiency (calories per hour per kg)
        df_engineered['Metabolic_Efficiency'] = df_engineered['Calories_Burned'] / (df_engineered['Session_Duration (hours)'] * df_engineered['Weight (kg)'])
        
        # 10. Polynomial features for key continuous variables
        key_features = ['Weight (kg)', 'Height (m)', 'Session_Duration (hours)', 'Age', 'Fat_Percentage']
        for feature in key_features:
            df_engineered[f'{feature}_squared'] = df_engineered[feature] ** 2
            df_engineered[f'{feature}_sqrt'] = np.sqrt(df_engineered[feature])
        
        # 11. Interaction features
        df_engineered['Weight_Duration_Interaction'] = df_engineered['Weight (kg)'] * df_engineered['Session_Duration (hours)']
        df_engineered['BMI_Duration_Interaction'] = df_engineered['BMI'] * df_engineered['Session_Duration (hours)']
        df_engineered['Age_Weight_Interaction'] = df_engineered['Age'] * df_engineered['Weight (kg)']
        df_engineered['Fat_Weight_Interaction'] = df_engineered['Fat_Percentage'] * df_engineered['Weight (kg)']
        
        # 12. Gender-specific features
        df_engineered['Gender_Weight'] = df_engineered['Weight (kg)'] * (df_engineered['Gender'] == 'Male').astype(int)
        df_engineered['Gender_Height'] = df_engineered['Height (m)'] * (df_engineered['Gender'] == 'Male').astype(int)
        
        # 13. Experience-based features
        df_engineered['Experience_Duration'] = df_engineered['Experience_Level'] * df_engineered['Session_Duration (hours)']
        df_engineered['Experience_Weight'] = df_engineered['Experience_Level'] * df_engineered['Weight (kg)']
        
        self.df_engineered = df_engineered
        print(f"Features after engineering: {df_engineered.shape[1]}")
        
        return df_engineered
    
    def prepare_features(self):
        """
        Prepare features for training, excluding BPM and water intake
        """
        print("Preparing features...")
        
        # Features to exclude as per requirements
        exclude_features = ['Max_BPM', 'Avg_BPM', 'Resting_BPM', 'Water_Intake (liters)', 'Calories_Burned']
        
        # Select features
        feature_cols = [col for col in self.df_engineered.columns if col not in exclude_features]
        
        X = self.df_engineered[feature_cols].copy()
        y = self.df_engineered['Calories_Burned'].copy()
        
        # Handle categorical variables
        categorical_cols = X.select_dtypes(include=['object']).columns
        
        for col in categorical_cols:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
            self.label_encoders[col] = le
        
        # Handle any remaining missing values
        X = X.fillna(X.median())
        
        # Remove infinite values
        X = X.replace([np.inf, -np.inf], np.nan).fillna(X.median())
        
        self.feature_names = X.columns.tolist()
        
        return X, y
    
    def feature_selection(self, X, y, k=20):
        """
        Advanced feature selection using multiple methods
        """
        print("Performing feature selection...")
        
        # Method 1: Statistical selection (SelectKBest)
        selector_stats = SelectKBest(score_func=f_regression, k=min(k, X.shape[1]))
        X_selected_stats = selector_stats.fit_transform(X, y)
        selected_features_stats = X.columns[selector_stats.get_support()]
        
        # Method 2: Recursive Feature Elimination with Random Forest
        rf_temp = RandomForestRegressor(n_estimators=50, random_state=42)
        rfe = RFE(estimator=rf_temp, n_features_to_select=min(k, X.shape[1]))
        X_selected_rfe = rfe.fit_transform(X, y)
        selected_features_rfe = X.columns[rfe.support_]
        
        # Combine both methods (union of selected features)
        combined_features = list(set(selected_features_stats) | set(selected_features_rfe))
        
        print(f"Selected {len(combined_features)} features out of {X.shape[1]}")
        print(f"Selected features: {combined_features[:10]}...")  # Show first 10
        
        return X[combined_features], combined_features
    
    def train_model(self, perform_feature_selection=True):
        """
        Train the Random Forest model with hyperparameter tuning
        """
        print("Training the model...")
        
        # Get features
        X, y = self.prepare_features()
        
        # Feature selection
        if perform_feature_selection:
            X, selected_features = self.feature_selection(X, y)
            self.selected_features = selected_features
        
        # Train-test split
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=pd.qcut(y, q=5, duplicates='drop')
        )
        
        # Scale features
        self.X_train_scaled = self.scaler.fit_transform(self.X_train)
        self.X_test_scaled = self.scaler.transform(self.X_test)
        
        # Hyperparameter tuning
        param_grid = {
            'n_estimators': [100, 200, 300],
            'max_depth': [10, 15, 20, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4],
            'max_features': ['sqrt', 'log2', None]
        }
        
        rf = RandomForestRegressor(random_state=42)
        
        # Use 5-fold cross-validation for hyperparameter tuning
        grid_search = GridSearchCV(
            rf, param_grid, cv=5, scoring='r2', n_jobs=-1, verbose=1
        )
        
        # Fit on original features (Random Forest handles scaling internally)
        grid_search.fit(self.X_train, self.y_train)
        
        self.model = grid_search.best_estimator_
        self.best_params = grid_search.best_params_
        
        print(f"Best parameters: {self.best_params}")
        
        return self.model
    
    def evaluate_model(self):
        """
        Comprehensive model evaluation
        """
        print("Evaluating the model...")
        
        # Predictions
        y_train_pred = self.model.predict(self.X_train)
        y_test_pred = self.model.predict(self.X_test)
        
        # Metrics
        train_r2 = r2_score(self.y_train, y_train_pred)
        test_r2 = r2_score(self.y_test, y_test_pred)
        train_rmse = np.sqrt(mean_squared_error(self.y_train, y_train_pred))
        test_rmse = np.sqrt(mean_squared_error(self.y_test, y_test_pred))
        train_mae = mean_absolute_error(self.y_train, y_train_pred)
        test_mae = mean_absolute_error(self.y_test, y_test_pred)
        
        print("=" * 50)
        print("MODEL EVALUATION RESULTS")
        print("=" * 50)
        print(f"Training R²: {train_r2:.4f}")
        print(f"Testing R²: {test_r2:.4f}")
        print(f"Training RMSE: {train_rmse:.2f}")
        print(f"Testing RMSE: {test_rmse:.2f}")
        print(f"Training MAE: {train_mae:.2f}")
        print(f"Testing MAE: {test_mae:.2f}")
        
        # Cross-validation
        cv_scores = cross_val_score(self.model, self.X_train, self.y_train, cv=5, scoring='r2')
        print(f"Cross-validation R² (mean ± std): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.X_train.columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nTop 10 Most Important Features:")
        print(feature_importance.head(10))
        
        # Visualization
        self.plot_results(y_train_pred, y_test_pred, feature_importance)
        
        return {
            'train_r2': train_r2, 'test_r2': test_r2,
            'train_rmse': train_rmse, 'test_rmse': test_rmse,
            'train_mae': train_mae, 'test_mae': test_mae,
            'cv_scores': cv_scores, 'feature_importance': feature_importance
        }
    
    def plot_results(self, y_train_pred, y_test_pred, feature_importance):
        """
        Plot comprehensive results
        """
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # Training predictions vs actual
        axes[0, 0].scatter(self.y_train, y_train_pred, alpha=0.6, color='blue')
        axes[0, 0].plot([self.y_train.min(), self.y_train.max()], 
                       [self.y_train.min(), self.y_train.max()], 'r--', lw=2)
        axes[0, 0].set_xlabel('Actual Calories')
        axes[0, 0].set_ylabel('Predicted Calories')
        axes[0, 0].set_title('Training Set: Actual vs Predicted')
        
        # Testing predictions vs actual
        axes[0, 1].scatter(self.y_test, y_test_pred, alpha=0.6, color='green')
        axes[0, 1].plot([self.y_test.min(), self.y_test.max()], 
                       [self.y_test.min(), self.y_test.max()], 'r--', lw=2)
        axes[0, 1].set_xlabel('Actual Calories')
        axes[0, 1].set_ylabel('Predicted Calories')
        axes[0, 1].set_title('Testing Set: Actual vs Predicted')
        
        # Residuals plot
        residuals = self.y_test - y_test_pred
        axes[1, 0].scatter(y_test_pred, residuals, alpha=0.6, color='orange')
        axes[1, 0].axhline(y=0, color='r', linestyle='--')
        axes[1, 0].set_xlabel('Predicted Calories')
        axes[1, 0].set_ylabel('Residuals')
        axes[1, 0].set_title('Residuals Plot')
        
        # Feature importance
        top_features = feature_importance.head(10)
        axes[1, 1].barh(range(len(top_features)), top_features['importance'])
        axes[1, 1].set_yticks(range(len(top_features)))
        axes[1, 1].set_yticklabels(top_features['feature'])
        axes[1, 1].set_xlabel('Importance')
        axes[1, 1].set_title('Top 10 Feature Importances')
        
        plt.tight_layout()
        plt.show()
    
    def predict_calories(self, age, gender, weight, height, session_duration, 
                        workout_type, fat_percentage, workout_frequency, experience_level):
        """
        Predict calories for new input
        """
        # Create input dataframe with same structure as training data
        input_data = pd.DataFrame({
            'Age': [age],
            'Gender': [gender],
            'Weight (kg)': [weight],
            'Height (m)': [height],
            'Session_Duration (hours)': [session_duration],
            'Workout_Type': [workout_type],
            'Fat_Percentage': [fat_percentage],
            'Workout_Frequency (days/week)': [workout_frequency],
            'Experience_Level': [experience_level],
            'BMI': [weight / (height ** 2)]
        })
        
        # Apply same feature engineering
        # (This would need to be adapted based on the specific features used)
        # For simplicity, assuming basic features for prediction
        
        prediction = self.model.predict(input_data)[0]
        return prediction
    
    def run_complete_pipeline(self):
        """
        Run the complete ML pipeline
        """
        print("🚀 Starting Complete Calories Burned Prediction Pipeline")
        print("=" * 60)
        
        # Step 1: Load and explore data
        self.load_and_explore_data()
        
        # Step 2: Visualize data
        self.visualize_data()
        
        # Step 3: Feature engineering
        self.advanced_feature_engineering()
        
        # Step 4: Train model
        self.train_model()
        
        # Step 5: Evaluate model
        results = self.evaluate_model()
        
        print("✅ Pipeline completed successfully!")
        return results

# Usage Example
if __name__ == "__main__":
    # Initialize the predictor with your CSV file path
    predictor = CaloriesBurnedPredictor('paste.txt')  # Replace with your actual CSV path
    
    # Run the complete pipeline
    results = predictor.run_complete_pipeline()
    
    # Example prediction
    print("\n" + "="*50)
    print("EXAMPLE PREDICTION")
    print("="*50)
    
    # Example: 30-year-old male, 75kg, 1.75m, 1.5 hours workout, HIIT, 20% fat, 4 days/week, experience level 2
    try:
        predicted_calories = predictor.predict_calories(
            age=30, gender='Male', weight=75, height=1.75, 
            session_duration=1.5, workout_type='HIIT', 
            fat_percentage=20, workout_frequency=4, experience_level=2
        )
        print(f"Predicted calories burned: {predicted_calories:.0f} calories")
    except Exception as e:
        print(f"Prediction example requires full feature engineering: {e}")
    
    print("\n📊 Model is ready for predictions!")
    print("💡 Use predictor.predict_calories() for new predictions")

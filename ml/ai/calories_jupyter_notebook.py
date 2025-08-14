{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Calories Burned Prediction Model 🔥\n",
    "\n",
    "This notebook creates a Random Forest model to predict calories burned based on workout and personal characteristics.\n",
    "\n",
    "**Features used:** Age, Gender, Weight, Height, Session Duration, Workout Type, Fat Percentage, Workout Frequency, Experience Level\n",
    "\n",
    "**Excluded:** BPM data and Water Intake (as requested)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 1. Import Libraries"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\n",
    "import numpy as np\n",
    "import matplotlib.pyplot as plt\n",
    "import seaborn as sns\n",
    "from sklearn.ensemble import RandomForestRegressor\n",
    "from sklearn.model_selection import train_test_split, GridSearchCV\n",
    "from sklearn.preprocessing import LabelEncoder\n",
    "from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error\n",
    "import pickle\n",
    "import warnings\n",
    "warnings.filterwarnings('ignore')\n",
    "\n",
    "# Set style for better plots\n",
    "plt.style.use('default')\n",
    "sns.set_palette(\"husl\")\n",
    "\n",
    "print(\"✅ Libraries imported successfully!\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 2. Load and Explore Data"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Load the data\n",
    "print(\"Loading data...\")\n",
    "df = pd.read_csv('paste.txt')  # Replace with your CSV file path\n",
    "\n",
    "print(f\"Dataset shape: {df.shape}\")\n",
    "print(f\"Missing values: {df.isnull().sum().sum()}\")\n",
    "\n",
    "# Display first few rows\n",
    "df.head()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Basic info about the dataset\n",
    "print(\"Dataset Info:\")\n",
    "df.info()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Basic statistics\n",
    "df.describe()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 3. Data Visualization"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Create visualizations\n",
    "fig, axes = plt.subplots(2, 3, figsize=(18, 12))\n",
    "\n",
    "# Distribution of target variable\n",
    "axes[0, 0].hist(df['Calories_Burned'], bins=30, alpha=0.7, color='skyblue')\n",
    "axes[0, 0].set_title('Distribution of Calories Burned')\n",
    "axes[0, 0].set_xlabel('Calories Burned')\n",
    "axes[0, 0].set_ylabel('Frequency')\n",
    "\n",
    "# Calories by Workout Type\n",
    "workout_calories = df.groupby('Workout_Type')['Calories_Burned'].mean()\n",
    "axes[0, 1].bar(workout_calories.index, workout_calories.values, color='lightcoral')\n",
    "axes[0, 1].set_title('Average Calories Burned by Workout Type')\n",
    "axes[0, 1].set_xlabel('Workout Type')\n",
    "axes[0, 1].set_ylabel('Average Calories Burned')\n",
    "axes[0, 1].tick_params(axis='x', rotation=45)\n",
    "\n",
    "# Calories by Gender\n",
    "gender_calories = df.groupby('Gender')['Calories_Burned'].mean()\n",
    "axes[0, 2].bar(gender_calories.index, gender_calories.values, color='lightgreen')\n",
    "axes[0, 2].set_title('Average Calories Burned by Gender')\n",
    "axes[0, 2].set_xlabel('Gender')\n",
    "axes[0, 2].set_ylabel('Average Calories Burned')\n",
    "\n",
    "# Weight vs Calories\n",
    "axes[1, 0].scatter(df['Weight (kg)'], df['Calories_Burned'], alpha=0.6, color='orange')\n",
    "axes[1, 0].set_title('Weight vs Calories Burned')\n",
    "axes[1, 0].set_xlabel('Weight (kg)')\n",
    "axes[1, 0].set_ylabel('Calories Burned')\n",
    "\n",
    "# Session Duration vs Calories\n",
    "axes[1, 1].scatter(df['Session_Duration (hours)'], df['Calories_Burned'], alpha=0.6, color='purple')\n",
    "axes[1, 1].set_title('Session Duration vs Calories Burned')\n",
    "axes[1, 1].set_xlabel('Session Duration (hours)')\n",
    "axes[1, 1].set_ylabel('Calories Burned')\n",
    "\n",
    "# Age vs Calories\n",
    "axes[1, 2].scatter(df['Age'], df['Calories_Burned'], alpha=0.6, color='brown')\n",
    "axes[1, 2].set_title('Age vs Calories Burned')\n",
    "axes[1, 2].set_xlabel('Age')\n",
    "axes[1, 2].set_ylabel('Calories Burned')\n",
    "\n",
    "plt.tight_layout()\n",
    "plt.show()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Correlation matrix\n",
    "numeric_cols = df.select_dtypes(include=[np.number]).columns\n",
    "plt.figure(figsize=(12, 10))\n",
    "correlation_matrix = df[numeric_cols].corr()\n",
    "sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, \n",
    "           square=True, linewidths=0.5)\n",
    "plt.title('Correlation Matrix of Numeric Features')\n",
    "plt.show()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 4. Feature Engineering"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "print(\"Performing feature engineering...\")\n",
    "\n",
    "# 1. Calculate BMI if not present\n",
    "if 'BMI' not in df.columns:\n",
    "    df['BMI'] = df['Weight (kg)'] / (df['Height (m)'] ** 2)\n",
    "    print(\"✅ BMI calculated\")\n",
    "\n",
    "# 2. BMR calculation (Basal Metabolic Rate)\n",
    "df['BMR'] = np.where(\n",
    "    df['Gender'] == 'Male',\n",
    "    10 * df['Weight (kg)'] + 6.25 * (df['Height (m)'] * 100) - 5 * df['Age'] + 5,\n",
    "    10 * df['Weight (kg)'] + 6.25 * (df['Height (m)'] * 100) - 5 * df['Age'] - 161\n",
    ")\n",
    "print(\"✅ BMR calculated\")\n",
    "\n",
    "# 3. Weight x Duration interaction (important for calorie burn)\n",
    "df['Weight_Duration'] = df['Weight (kg)'] * df['Session_Duration (hours)']\n",
    "print(\"✅ Weight-Duration interaction created\")\n",
    "\n",
    "# 4. BMI x Duration interaction\n",
    "df['BMI_Duration'] = df['BMI'] * df['Session_Duration (hours)']\n",
    "print(\"✅ BMI-Duration interaction created\")\n",
    "\n",
    "# 5. Workout intensity score\n",
    "df['Workout_Intensity'] = df['Experience_Level'] * df['Workout_Frequency (days/week)']\n",
    "print(\"✅ Workout intensity calculated\")\n",
    "\n",
    "# 6. Body fat categories\n",
    "df['Fat_Category'] = pd.cut(df['Fat_Percentage'], \n",
    "                           bins=[0, 15, 25, 35, 100], \n",
    "                           labels=['Low', 'Normal', 'High', 'Very_High'])\n",
    "print(\"✅ Fat categories created\")\n",
    "\n",
    "print(f\"\\nFeatures after engineering: {df.shape[1]}\")\n",
    "print(\"New features:\", ['BMI', 'BMR', 'Weight_Duration', 'BMI_Duration', 'Workout_Intensity', 'Fat_Category'])"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 5. Prepare Features for Training"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Prepare features (excluding BPM and water intake as requested)\n",
    "exclude_cols = ['Max_BPM', 'Avg_BPM', 'Resting_BPM', 'Water_Intake (liters)', 'Calories_Burned']\n",
    "feature_cols = [col for col in df.columns if col not in exclude_cols]\n",
    "\n",
    "X = df[feature_cols].copy()\n",
    "y = df['Calories_Burned'].copy()\n",
    "\n",
    "print(f\"Features used for training: {list(X.columns)}\")\n",
    "print(f\"Target variable: Calories_Burned\")\n",
    "print(f\"Dataset shape: {X.shape}\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Handle categorical variables\n",
    "categorical_cols = X.select_dtypes(include=['object']).columns\n",
    "label_encoders = {}\n",
    "\n",
    "print(f\"Categorical columns to encode: {list(categorical_cols)}\")\n",
    "\n",
    "for col in categorical_cols:\n",
    "    le = LabelEncoder()\n",
    "    X[col] = le.fit_transform(X[col].astype(str))\n",
    "    label_encoders[col] = le\n",
    "    print(f\"✅ {col} encoded\")\n",
    "\n",
    "print(f\"\\nFinal feature set ready for training!\")\n",
    "X.head()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 6. Train-Test Split"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Train-test split\n",
    "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n",
    "\n",
    "print(f\"Training set size: {X_train.shape[0]} samples\")\n",
    "print(f\"Testing set size: {X_test.shape[0]} samples\")\n",
    "print(f\"Number of features: {X_train.shape[1]}\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 7. Train Random Forest Model"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Hyperparameter tuning (simplified)\n",
    "print(\"Training Random Forest with hyperparameter tuning...\")\n",
    "\n",
    "param_grid = {\n",
    "    'n_estimators': [100, 200, 300],\n",
    "    'max_depth': [10, 15, 20],\n",
    "    'min_samples_split': [2, 5],\n",
    "    'min_samples_leaf': [1, 2]\n",
    "}\n",
    "\n",
    "rf = RandomForestRegressor(random_state=42)\n",
    "grid_search = GridSearchCV(rf, param_grid, cv=5, scoring='r2', n_jobs=-1, verbose=1)\n",
    "grid_search.fit(X_train, y_train)\n",
    "\n",
    "# Best model\n",
    "best_model = grid_search.best_estimator_\n",
    "print(f\"\\n✅ Training completed!\")\n",
    "print(f\"Best parameters: {grid_search.best_params_}\")\n",
    "print(f\"Best CV score: {grid_search.best_score_:.4f}\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 8. Model Evaluation"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Make predictions\n",
    "y_train_pred = best_model.predict(X_train)\n",
    "y_test_pred = best_model.predict(X_test)\n",
    "\n",
    "# Calculate metrics\n",
    "train_r2 = r2_score(y_train, y_train_pred)\n",
    "test_r2 = r2_score(y_test, y_test_pred)\n",
    "train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))\n",
    "test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))\n",
    "test_mae = mean_absolute_error(y_test, y_test_pred)\n",
    "\n",
    "print(\"=\" * 40)\n",
    "print(\"MODEL PERFORMANCE\")\n",
    "print(\"=\" * 40)\n",
    "print(f\"Training R²: {train_r2:.4f}\")\n",
    "print(f\"Testing R²: {test_r2:.4f}\")\n",
    "print(f\"Testing RMSE: {test_rmse:.2f} calories\")\n",
    "print(f\"Testing MAE: {test_mae:.2f} calories\")\n",
    "\n",
    "# Feature importance\n",
    "feature_importance = pd.DataFrame({\n",
    "    'feature': X.columns,\n",
    "    'importance': best_model.feature_importances_\n",
    "}).sort_values('importance', ascending=False)\n",
    "\n",
    "print(f\"\\nTop 5 Important Features:\")\n",
    "for i, row in feature_importance.head().iterrows():\n",
    "    print(f\"  {row['feature']}: {row['importance']:.4f}\")\n",
    "\n",
    "feature_importance"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 9. Visualization of Results"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Create comprehensive visualizations\n",
    "fig, axes = plt.subplots(1, 3, figsize=(18, 6))\n",
    "\n",
    "# Actual vs Predicted\n",
    "axes[0].scatter(y_test, y_test_pred, alpha=0.6, color='blue')\n",
    "axes[0].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)\n",
    "axes[0].set_xlabel('Actual Calories')\n",
    "axes[0].set_ylabel('Predicted Calories')\n",
    "axes[0].set_title(f'Actual vs Predicted (R² = {test_r2:.3f})')\n",
    "axes[0].grid(True, alpha=0.3)\n",
    "\n",
    "# Feature importance\n",
    "top_features = feature_importance.head(8)\n",
    "axes[1].barh(range(len(top_features)), top_features['importance'], color='green', alpha=0.7)\n",
    "axes[1].set_yticks(range(len(top_features)))\n",
    "axes[1].set_yticklabels(top_features['feature'])\n",
    "axes[1].set_xlabel('Importance')\n",
    "axes[1].set_title('Top 8 Feature Importances')\n",
    "axes[1].grid(True, alpha=0.3)\n",
    "\n",
    "# Residuals\n",
    "residuals = y_test - y_test_pred\n",
    "axes[2].scatter(y_test_pred, residuals, alpha=0.6, color='orange')\n",
    "axes[2].axhline(y=0, color='r', linestyle='--', lw=2)\n",
    "axes[2].set_xlabel('Predicted Calories')\n",
    "axes[2].set_ylabel('Residuals')\n",
    "axes[2].set_title('Residuals Plot')\n",
    "axes[2].grid(True, alpha=0.3)\n",
    "\n",
    "plt.tight_layout()\n",
    "plt.show()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 10. Save Model as Pickle File"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Prepare model data for saving\n",
    "model_data = {\n",
    "    'model': best_model,\n",
    "    'label_encoders': label_encoders,\n",
    "    'feature_columns': list(X.columns),\n",
    "    'model_performance': {\n",
    "        'test_r2': test_r2,\n",
    "        'test_rmse': test_rmse,\n",
    "        'test_mae': test_mae\n",
    "    }\n",
    "}\n",
    "\n",
    "# Export as pickle file\n",
    "with open('calories_prediction_model.pkl', 'wb') as f:\n",
    "    pickle.dump(model_data, f)\n",
    "\n",
    "print(f\"✅ Model saved as 'calories_prediction_model.pkl'\")\n",
    "print(f\"📦 Saved data includes:\")\n",
    "print(f\"   - Trained Random Forest model\")\n",
    "print(f\"   - Label encoders for categorical variables\")\n",
    "print(f\"   - Feature column names\")\n",
    "print(f\"   - Model performance metrics\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 11. Test Model Loading"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Test loading the saved model\n",
    "print(\"Testing model loading...\")\n",
    "with open('calories_prediction_model.pkl', 'rb') as f:\n",
    "    loaded_model = pickle.load(f)\n",
    "    \n",
    "print(f\"✅ Model loaded successfully!\")\n",
    "print(f\"📊 Model performance: R² = {loaded_model['model_performance']['test_r2']:.4f}\")\n",
    "print(f\"🎯 RMSE = {loaded_model['model_performance']['test_rmse']:.2f} calories\")\n",
    "print(f\"📈 MAE = {loaded_model['model_performance']['test_mae']:.2f} calories\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 12. Create Prediction Function"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "def predict_calories(age, gender, weight, height, session_duration, workout_type, \n",
    "                    fat_percentage, workout_frequency, experience_level, model_data):\n",
    "    \"\"\"\n",
    "    Make a prediction with the saved model\n",
    "    \"\"\"\n",
    "    # Create input dataframe\n",
    "    input_df = pd.DataFrame({\n",
    "        'Age': [age],\n",
    "        'Gender': [gender],\n",
    "        'Weight (kg)': [weight],\n",
    "        'Height (m)': [height],\n",
    "        'Session_Duration (hours)': [session_duration],\n",
    "        'Workout_Type': [workout_type],\n",
    "        'Fat_Percentage': [fat_percentage],\n",
    "        'Workout_Frequency (days/week)': [workout_frequency],\n",
    "        'Experience_Level': [experience_level],\n",
    "    })\n",
    "    \n",
    "    # Feature engineering (same as training)\n",
    "    input_df['BMI'] = input_df['Weight (kg)'] / (input_df['Height (m)'] ** 2)\n",
    "    input_df['BMR'] = np.where(\n",
    "        input_df['Gender'] == 'Male',\n",
    "        10 * input_df['Weight (kg)'] + 6.25 * (input_df['Height (m)'] * 100) - 5 * input_df['Age'] + 5,\n",
    "        10 * input_df['Weight (kg)'] + 6.25 * (input_df['Height (m)'] * 100) - 5 * input_df['Age'] - 161\n",
    "    )\n",
    "    input_df['Weight_Duration'] = input_df['Weight (kg)'] * input_df['Session_Duration (hours)']\n",
    "    input_df['BMI_Duration'] = input_df['BMI'] * input_df['Session_Duration (hours)']\n",
    "    input_df['Workout_Intensity'] = input_df['Experience_Level'] * input_df['Workout_Frequency (days/week)']\n",
    "    input_df['Fat_Category'] = pd.cut(input_df['Fat_Percentage'], \n",
    "                                     bins=[0, 15, 25, 35, 100], \n",
    "                                     labels=['Low', 'Normal', 'High', 'Very_High'])\n",
    "    \n",
    "    # Encode categorical variables\n",
    "    for col, encoder in model_data['label_encoders'].items():\n",
    "        if col in input_df.columns:\n",
    "            input_df[col] = encoder.transform(input_df[col].astype(str))\n",
    "    \n",
    "    # Make prediction\n",
    "    prediction = model_data['model'].predict(input_df[model_data['feature_columns']])[0]\n",
    "    return prediction\n",
    "\n",
    "print(\"✅ Prediction function created!\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 13. Example Predictions"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "print(\"=\" * 40)\n",
    "print(\"EXAMPLE PREDICTIONS\")\n",
    "print(\"=\" * 40)\n",
    "\n",
    "# Example 1: 30-year-old male, 75kg, 1.75m, 1.5 hours HIIT\n",
    "prediction1 = predict_calories(\n",
    "    age=30, gender='Male', weight=75, height=1.75, \n",
    "    session_duration=1.5, workout_type='HIIT', \n",
    "    fat_percentage=20, workout_frequency=4, experience_level=2,\n",
    "    model_data=model_data\n",
    ")\n",
    "\n",
    "print(f\"Example 1 - Male, 30, 75kg, HIIT 1.5h: {prediction1:.0f} calories\")\n",
    "\n",
    "# Example 2: 25-year-old female, 60kg, 1.65m, 1 hour Cardio\n",
    "prediction2 = predict_calories(\n",
    "    age=25, gender='Female', weight=60, height=1.65, \n",
    "    session_duration=1.0, workout_type='Cardio', \n",
    "    fat_percentage=25, workout_frequency=3, experience_level=1,\n",
    "    model_data=model_data\n",
    ")\n",
    "\n",
    "print(f\"Example 2 - Female, 25, 60kg, Cardio 1h: {prediction2:.0f} calories\")\n",
    "\n",
    "# Example 3: 40-year-old male, 90kg, 1.80m, 2 hours Strength\n",
    "prediction3 = predict_calories(\n",
    "    age=40, gender='Male', weight=90, height=1.80, \n",
    "    session_duration=2.0, workout_type='Strength', \n",
    "    fat_percentage=18, workout_frequency=5, experience_level=3,\n",
    "    model_data=model_data\n",
    ")\n",
    "\n",
    "print(f\"Example 3 - Male, 40, 90kg, Strength 2h: {prediction3:.0f} calories\")"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 14. Summary\n",
    "\n",
    "🎉 **Model Training Complete!**\n",
    "\n",
    "### What we built:\n",
    "- **Random Forest Regressor** with optimized hyperparameters\n",
    "- **6 engineered features** to improve prediction accuracy\n",
    "- **Comprehensive evaluation** with multiple metrics\n",
    "- **Pickle export** for easy model deployment\n",
    "\n",
    "### Features used:\n",
    "✅ Age, Gender, Weight, Height, Session Duration  \n",
    "✅ Workout Type, Fat Percentage, Workout Frequency, Experience Level  \n",
    "✅ BMI, BMR, Weight×Duration, BMI×Duration, Workout Intensity, Fat Categories  \n",
    "❌ BPM data and Water Intake (excluded as requested)\n",
    "\n",
    "### Model Performance:\n",
    "- **R² Score**: Measures how well the model explains variance in calorie burn\n",
    "- **RMSE**: Average prediction error in calories\n",
    "- **MAE**: Typical absolute error in calories\n",
    "\n",
    "### Next Steps:\n",
    "1. Use `calories_prediction_model.pkl` in other projects\n",
    "2. Load with: `pickle.load(open('calories_prediction_model.pkl', 'rb'))`\n",
    "3. Make predictions with the `predict_calories()` function\n",
    "\n",
    "**Ready for deployment! 🚀**"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/
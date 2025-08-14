import pandas as pd
import numpy as np

class calorie_estimator:
    def __init__(self):
        self.csv_path = "../data/gym_members_exercise_tracking.csv"
        self.df = pd.read_csv(self.csv_path)
        self.df_og = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.model = None
        self.label_encoders = {}
        self.feature_names = []

    
    def data_describe_And_loader(self):
        print("\nDataset Info:")
        print(self.df.info())
        print("\nFirst 5 rows:")
        print(self.df.head())
        print("\nBasic statistics:")
        print(self.df.describe())
        # The data is already stored as a class instance, but I am still returning it for future 
        # usability
        return self.df
    
    def naming_correction(self):
        new_names = {"Weight (kg)": "Weight",
                     "Height (m)": "Height",
                     "Session_Duration (hours)" : "Session_Duration",
                     "Water_Intake (liters)": "Water_Intake",
                     "Workout_Frequency (days/week)": "Workout_Frequency"}
        self.df.rename(columns=new_names, inplace=True)


    def bmi_Cal(self):
        if 'BMI' not in self.df.columns:
            self.df['BMI'] = self.df['Weight'] / (self.df['Height'] ** 2)

    
    def feature_engineering(self):
        self.df['BMR'] = np.where(self.df['Gender']=='Male',
                                10 * self.df['Weight'] + 6.25 * (self.df['Height'] * 100) - 5 * self.df['Age'] + 5,
                                10 * self.df['Weight'] + 6.25 * (self.df['Height'] * 100) - 5 * self.df['Age'] - 161)
        self.df['Weight_Duration'] = self.df['Weight'] * self.df['Session_Duration']
        self.df['BMI_Duration'] = self.df['BMI'] * self.df['Session_Duration']
        modelling_intensity = self.df['Experience_Level'] * self.df['Workout_Frequency']
        self.df['Intensity'] = pd.qcut(modelling_intensity, q =5, labels=[1,2,3,4,5])
        self.df['Fat_Category'] = pd.cut(self.df['Fat_Percentage'],bins=[0, 15, 25, 35, 100],labels=['Low', 'Normal', 'High', 'Very_High'])
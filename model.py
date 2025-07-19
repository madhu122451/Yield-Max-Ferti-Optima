import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv('f2.csv')

# Handle categorical variables
label_encoders = {}
categorical_features = ['Soil Type', 'Crop Type']
for col in categorical_features:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Define features and target
X = df.drop(columns=['Fertilizer Name'])  # Features
y = df['Fertilizer Name']  # Target

# Encode target variable
target_encoder = LabelEncoder()
y = target_encoder.fit_transform(y)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save model and encoders
joblib.dump(model, 'fertilizer_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(target_encoder, 'target_encoder.pkl')
for col, le in label_encoders.items():
    joblib.dump(le, f'label_encoder_{col}.pkl')

print("Model training completed and saved!")

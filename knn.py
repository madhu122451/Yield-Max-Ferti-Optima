import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier

# Load dataset (Replace 'your_dataset.csv' with the actual file name)
df = pd.read_csv("f2.csv")

# Encode categorical variables
label_encoder_soil = LabelEncoder()
label_encoder_crop = LabelEncoder()
target_encoder = LabelEncoder()

df["Soil Type"] = label_encoder_soil.fit_transform(df["Soil Type"])
df["Crop Type"] = label_encoder_crop.fit_transform(df["Crop Type"])
df["Fertilizer Name"] = target_encoder.fit_transform(df["Fertilizer Name"])  # Target variable

# Select features and target
X = df.drop(columns=["Fertilizer Name"])  # Features
y = df["Fertilizer Name"]  # Target variable

# Split dataset into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize numerical features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train the KNN model
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_scaled, y_train)

# Save the trained model and encoders
joblib.dump(knn, "knn_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(target_encoder, "target_encoder.pkl")

print("✅ KNN model and encoders saved successfully as knn_model.pkl!")

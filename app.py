from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
from flask_pymongo import PyMongo

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load trained models and encoders
try:
    model = joblib.load("fertilizer_model.pkl")  
    knn_model = joblib.load("knn_model.pkl")  
    scaler = joblib.load("scaler.pkl")  
    target_encoder = joblib.load("target_encoder.pkl")  
    label_encoder_soil = joblib.load("label_encoder_Soil Type.pkl")  
    label_encoder_crop = joblib.load("label_encoder_Crop Type.pkl")  
    print("✅ Models and encoders loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models or encoders: {e}")

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/fertilizerDB"
mongo = PyMongo(app)

@app.route('/api/recommendation', methods=['POST'])
def recommend_fertilizer():
    try:
        # Get JSON data from the request
        data = request.get_json()
        print("Received request:", data)  # Debugging log

        # Validate required fields
        if not all(key in data['soilData'] for key in ['soil_type', 'crop_type', 'nitrogen', 'potassium', 'phosphorus']) or \
           not all(key in data['weatherData'] for key in ['temperature', 'humidity', 'moisture']):
            return jsonify({'error': 'Missing required fields in input data.'}), 400

        # Extract soil and weather data
        temperature = float(data['weatherData']['temperature'])
        humidity = float(data['weatherData']['humidity'])
        moisture = float(data['weatherData']['moisture'])
        soil_type = data['soilData']['soil_type']
        crop_type = data['soilData']['crop_type']
        nitrogen = float(data['soilData']['nitrogen'])
        potassium = float(data['soilData']['potassium'])
        phosphorus = float(data['soilData']['phosphorus'])

        # Encode categorical features
        try:
            soil_type_encoded = label_encoder_soil.transform([soil_type])[0]
            crop_type_encoded = label_encoder_crop.transform([crop_type])[0]
        except Exception as e:
            return jsonify({'error': f"Encoding error: {e}"}), 400

        # Prepare feature vector for prediction
        features = np.array([[temperature, humidity, moisture, soil_type_encoded, crop_type_encoded, nitrogen, potassium, phosphorus]])

        # Standardize numerical features
        features_scaled = scaler.transform(features)

        # Try predicting with the primary model
        try:
            prediction = model.predict(features_scaled)[0]
            fertilizer_name = target_encoder.inverse_transform([prediction])[0]
        except Exception as e:
            print(f"⚠️ Primary model failed, switching to KNN: {e}")
            prediction = knn_model.predict(features_scaled)[0]
            fertilizer_name = target_encoder.inverse_transform([prediction])[0]

        # Save data to MongoDB
        mongo.db.recommendations.insert_one({
            "soil_type": soil_type,
            "crop_type": crop_type,
            "temperature": temperature,
            "humidity": humidity,
            "moisture": moisture,
            "nitrogen": nitrogen,
            "potassium": potassium,
            "phosphorus": phosphorus,
            "recommended_fertilizer": fertilizer_name
        })

        return jsonify({'recommendation': fertilizer_name})

    except Exception as e:
        return jsonify({'error': f'Error processing your request: {e}'}), 500

@app.route('/get_data', methods=['GET'])
def get_data():
    try:
        data = list(mongo.db.recommendations.find({}, {"_id": 0}))  # Exclude ObjectId from response
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

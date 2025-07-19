// AngularJS Application
var app = angular.module('FertilizerApp', []);

// Controller definition
app.controller('MainController', function($scope, $http) {
    // Initialize data models
    $scope.soilData = {};
    $scope.weatherData = {};
    $scope.cropData = {};
    $scope.recommendation = null;
    $scope.suggestions = {
        soilType: [],
        nitrogen: [],
        phosphorus: [],
        potassium: [],
        cropType: []
    };

    // Dummy data for suggestions (replace this with real data or API calls)
    var soilTypes = ['Loamy', 'Clayey', 'Sandy', 'Red', 'Black'];
    var nutrients = {
        nitrogen: ['Low', 'Medium', 'High'],
        phosphorus: ['Low', 'Medium', 'High'],
        potassium: ['Low', 'Medium', 'High']
    };
    var cropTypes = ['Wheat', 'rice','Barley', 'Cotton', 'coffee', 'Tobacco', 'Pulses', 'Paddy', 'Millets', 'Maize', 'Ground Nuts', 'Sugarcane', 'Oil seeds', 'kidneybeans', 'orange', 'pomegranate', 'watermelon'];

    // Suggest soil types based on user input
    $scope.suggestSoilType = function() {
        $scope.suggestions.soilType = soilTypes.filter(function(type) {
            return type.toLowerCase().includes($scope.soilData.soilType.toLowerCase());
        });
    };

    // Suggest nutrients based on user input
    $scope.suggestNutrient = function(nutrient) {
        $scope.suggestions[nutrient] = nutrients[nutrient].filter(function(level) {
            return level.toLowerCase().includes($scope.soilData[nutrient] ? $scope.soilData[nutrient].toLowerCase() : '');
        });
    };

    // Suggest crop types based on user input
    $scope.suggestCropType = function() {
        $scope.suggestions.cropType = cropTypes.filter(function(crop) {
            return crop.toLowerCase().includes($scope.soilData.cropType.toLowerCase());
        });
    };

    // Select a suggestion
    $scope.selectSuggestion = function(suggestion, field) {
        $scope.soilData[field] = suggestion;
        $scope.suggestions[field] = []; // Clear suggestions
    };

    // Function to get fertilizer recommendation
    $scope.getRecommendation = function() {
        var data = {
            soilData: {
                soil_type: $scope.soilData.soilType,
                nitrogen: $scope.soilData.nitrogen,
                phosphorus: $scope.soilData.phosphorus,
                potassium: $scope.soilData.potassium,
                humidity: $scope.soilData.humidity,
                moisture: $scope.soilData.moisture,
                crop_type: $scope.soilData.cropType
            },
            weatherData: {
                temperature: $scope.cropData.temperature,
                humidity: $scope.soilData.humidity,
                moisture: $scope.soilData.moisture
            }
        };

        console.log("Data being sent:", data);  // Log the data being sent for debugging

        // Send POST request to Flask API
        $http.post('http://127.0.0.1:5000/api/recommendation', data)
            .then(function(response) {
                // Check if the recommendation is available
                if (response.data.recommendation) {
                    localStorage.setItem('recommendation', response.data.recommendation);
                    window.location.href = 'result.html';  // Redirect to the result page
                } else {
                    $scope.recommendation = "No recommendation found.";
                    
                }
            })
            .catch(function(error) {
                console.error("Error:", error);  // Log error details for debugging
                $scope.recommendation = "Error: " + (error.data ? error.data.message : error.message);
            });
    };
});

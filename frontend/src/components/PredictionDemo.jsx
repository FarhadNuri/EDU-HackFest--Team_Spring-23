import React, { useState } from 'react';
import { predictionAPI } from '../services/api';
import { useAPI } from '../hooks/useAPI';
import { useToast } from '../context/ToastContext';

const PredictionDemo = ({ onClose }) => {
  const [selectedCropId, setSelectedCropId] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const { loading, error, callAPI } = useAPI();
  const { showSuccess, showError } = useToast();

  // Mock crop IDs for demo (in real app, these would come from crop list)
  const mockCrops = [
    { id: '674abc123def456789012345', name: 'Rice Batch #1', type: 'Rice' },
    { id: '674def456789012345abc123', name: 'Wheat Storage A', type: 'Wheat' },
    { id: '674ghi789012345def456abc', name: 'Maize Silo B', type: 'Maize' },
  ];

  const getPrediction = async () => {
    if (!selectedCropId) {
      showError('Please select a crop first');
      return;
    }

    const result = await callAPI(
      () => predictionAPI.getCropPrediction(selectedCropId),
      {
        onSuccess: (data) => {
          setPredictionResult(data);
          showSuccess('Prediction generated successfully!');
        },
        onError: (error) => {
          showError(`Failed to get prediction: ${error.message}`);
        }
      }
    );
  };

  const getAllPredictions = async () => {
    const result = await callAPI(
      () => predictionAPI.getAllPredictions(),
      {
        onSuccess: (data) => {
          setPredictionResult(data);
          showSuccess('All predictions loaded!');
        },
        onError: (error) => {
          showError(`Failed to get predictions: ${error.message}`);
        }
      }
    );
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Prediction API Demo</h2>
              <p className="text-gray-600">Test the A4 Prediction Engine functionality</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Controls */}
          <div className="mb-6 space-y-4">
            {/* Single Crop Prediction */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Single Crop Prediction</h3>
              <div className="flex gap-3">
                <select
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  <option value="">Select a crop...</option>
                  {mockCrops.map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name} ({crop.type})
                    </option>
                  ))}
                </select>
                <button
                  onClick={getPrediction}
                  disabled={loading || !selectedCropId}
                  className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Get Prediction'}
                </button>
              </div>
            </div>

            {/* All Predictions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">All Crop Predictions</h3>
              <button
                onClick={getAllPredictions}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Get All Predictions'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600"><strong>Error:</strong> {error.message}</p>
              {error.status && <p className="text-sm text-red-500">Status: {error.status}</p>}
            </div>
          )}

          {/* Results */}
          {predictionResult && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Prediction Results</h3>
              
              {/* Single Prediction Result */}
              {predictionResult.crop && (
                <div className="bg-white border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Crop Info */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Crop Information</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Type:</span> {predictionResult.crop.type}</p>
                        <p><span className="font-medium">Weight:</span> {predictionResult.crop.weight} kg</p>
                        <p><span className="font-medium">Storage:</span> {predictionResult.crop.storageType}</p>
                        <p><span className="font-medium">Location:</span> {predictionResult.crop.storageLocation}</p>
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Risk Assessment</h4>
                      <div className={`inline-block px-3 py-1 rounded-lg border ${getRiskLevelColor(predictionResult.prediction?.riskLevel)}`}>
                        <span className="font-semibold">{predictionResult.prediction?.riskLevel} Risk</span>
                      </div>
                      <div className="text-sm mt-2 space-y-1">
                        <p><span className="font-medium">ETCL:</span> {predictionResult.prediction?.etcl} hours</p>
                        <p><span className="font-medium">Risk Score:</span> {predictionResult.prediction?.riskScore}/100</p>
                        <p><span className="font-medium">Timeframe:</span> {predictionResult.timeframe}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Conditions */}
                  {predictionResult.prediction?.currentConditions && (
                    <div className="mt-4 bg-gray-50 p-3 rounded">
                      <h5 className="font-medium text-gray-800 mb-2">Current Conditions</h5>
                      <div className="text-sm grid grid-cols-3 gap-4">
                        <div>Temperature: {predictionResult.prediction.currentConditions.temperature}°C</div>
                        <div>Moisture: {predictionResult.prediction.currentConditions.moisture}%</div>
                        <div>Humidity: {predictionResult.prediction.currentConditions.humidity}%</div>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {predictionResult.summary && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <h5 className="font-medium text-gray-800 mb-2">Summary</h5>
                      <p className="text-sm text-gray-700">{predictionResult.summary}</p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {predictionResult.recommendations?.length > 0 && (
                    <div className="mt-4 p-3 bg-lime-50 rounded">
                      <h5 className="font-medium text-gray-800 mb-2">Recommendations</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {predictionResult.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Multiple Predictions Result */}
              {predictionResult.predictions && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                    <div className="text-sm grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>Total Crops: {predictionResult.summary?.totalCrops || 0}</div>
                      <div>High Risk: {predictionResult.summary?.highRiskCrops || 0}</div>
                      <div>Location: {predictionResult.summary?.location || 'N/A'}</div>
                      <div>Weather: {predictionResult.summary?.weatherCondition || 'N/A'}</div>
                    </div>
                  </div>

                  {predictionResult.predictions.map((pred, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">{pred.crop.type} - {pred.crop.storageType}</h5>
                        <div className={`px-3 py-1 rounded-lg border text-sm ${getRiskLevelColor(pred.riskLevel)}`}>
                          {pred.riskLevel}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
                        <div>ETCL: {pred.etcl} hours</div>
                        <div>Risk Score: {pred.riskScore}/100</div>
                        <div>Weight: {pred.crop.weight} kg</div>
                        <div>Priority: {pred.priority}</div>
                      </div>
                      <p className="text-sm mt-2 text-gray-700">{pred.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Raw JSON (for debugging) */}
          {predictionResult && (
            <details className="mt-6">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">Show Raw JSON Response</summary>
              <pre className="mt-2 bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
                {JSON.stringify(predictionResult, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionDemo;
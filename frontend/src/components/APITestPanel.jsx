import React, { useState, useEffect } from 'react';
import { predictionAPI, weatherAPI, handleAPIError } from '../services/api';
import { useToast } from '../context/ToastContext';

const APITestPanel = ({ onClose }) => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const { showSuccess, showError } = useToast();

  const tests = [
    {
      name: 'Backend Health Check',
      test: async () => {
        const response = await fetch('http://localhost:5000/api/health');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return { status: 'Backend server is running' };
      }
    },
    {
      name: 'Weather API',
      test: async () => {
        return await weatherAPI.getWeather();
      }
    },
    {
      name: 'Prediction Cache Stats',
      test: async () => {
        return await predictionAPI.getCacheStats();
      }
    }
  ];

  const runTest = async (test) => {
    try {
      const result = await test.test();
      return { success: true, data: result };
    } catch (error) {
      const errorInfo = handleAPIError(error);
      return { success: false, error: errorInfo };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const results = {};

    for (const test of tests) {
      const result = await runTest(test);
      results[test.name] = result;
      setTestResults({ ...results });
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    
    const successCount = Object.values(results).filter(r => r.success).length;
    if (successCount === tests.length) {
      showSuccess(`All ${tests.length} tests passed!`);
    } else {
      showError(`${tests.length - successCount} tests failed`);
    }
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (result) => {
    if (!result) return '⏳';
    return result.success ? '✅' : '❌';
  };

  const getStatusColor = (result) => {
    if (!result) return 'text-gray-500';
    return result.success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">API Integration Test</h2>
              <p className="text-gray-600">Testing backend connectivity and API endpoints</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Test Controls */}
          <div className="mb-6">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running Tests...' : 'Run Tests Again'}
            </button>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            {tests.map((test) => {
              const result = testResults[test.name];
              return (
                <div key={test.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <span className="text-2xl">{getStatusIcon(result)}</span>
                  </div>
                  
                  {result && (
                    <div className="text-sm">
                      {result.success ? (
                        <div className="text-green-600">
                          <p>✓ Success</p>
                          {result.data && (
                            <pre className="mt-2 bg-green-50 p-2 rounded text-xs overflow-auto">
                              {JSON.stringify(result.data, null, 2).slice(0, 200)}
                              {JSON.stringify(result.data, null, 2).length > 200 ? '...' : ''}
                            </pre>
                          )}
                        </div>
                      ) : (
                        <div className="text-red-600">
                          <p>✗ Failed: {result.error?.message}</p>
                          {result.error && (
                            <p className="text-xs mt-1">Status: {result.error.status}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {isRunning && !result && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Running...
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Connection Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Connection Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Frontend:</strong> http://localhost:5173/</p>
              <p><strong>Backend:</strong> http://localhost:5000/</p>
              <p><strong>API Base:</strong> http://localhost:5000/api</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITestPanel;
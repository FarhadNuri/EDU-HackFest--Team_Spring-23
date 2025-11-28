import { useState, useCallback } from 'react';
import { handleAPIError } from '../services/api';

export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAPI = useCallback(async (apiCall, options = {}) => {
    const { 
      showLoading = true, 
      onSuccess = null, 
      onError = null,
      clearErrorOnStart = true 
    } = options;

    if (showLoading) setLoading(true);
    if (clearErrorOnStart) setError(null);

    try {
      const response = await apiCall();
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo);
      
      if (onError) {
        onError(errorInfo);
      }
      
      return { success: false, error: errorInfo };
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callAPI,
    clearError,
  };
};

export default useAPI;
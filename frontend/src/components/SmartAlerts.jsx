import { useState, useEffect } from 'react';
import { alertAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const SmartAlerts = ({ onClose }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertAPI.generateAlerts();
      
      if (response.data.success) {
        setAlerts(response.data.alerts || []);
        
        // Simulate SMS in browser console for Critical alerts
        response.data.alerts.forEach(alert => {
          if (alert.riskLevel === 'Critical') {
            console.log('\n🚨 SMS NOTIFICATION SIMULATION 🚨');
            console.log('═══════════════════════════════════════');
            console.log(`Crop: ${alert.cropType}`);
            console.log(`Risk: ${alert.riskLevel}`);
            console.log(`Message: ${alert.message}`);
            console.log(`Time: ${new Date(alert.timestamp).toLocaleString('bn-BD')}`);
            console.log('═══════════════════════════════════════\n');
          }
        });
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to generate alerts');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Critical':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'High':
        return 'bg-orange-100 border-orange-500 text-orange-900';
      case 'Medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      default:
        return 'bg-green-100 border-green-500 text-green-900';
    }
  };

  const getRiskIcon = (riskLevel) => {
    if (riskLevel === 'Critical' || riskLevel === 'High') {
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div>
              <h2 className="text-xl font-bold">{t('Smart Alerts', 'স্মার্ট সতর্কতা')}</h2>
              <p className="text-sm text-orange-100">{t('AI-Powered Recommendations', 'এআই-চালিত সুপারিশ')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mb-6"></div>
              <p className="text-gray-700 font-semibold text-lg">{t('Generating smart alerts...', 'স্মার্ট সতর্কতা তৈরি হচ্ছে...')}</p>
              <p className="text-sm text-gray-500 mt-2">{t('Analyzing crop data, weather, and risks', 'ফসলের তথ্য, আবহাওয়া এবং ঝুঁকি বিশ্লেষণ করা হচ্ছে')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <svg className="w-20 h-20 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 font-bold text-lg mb-2">{error}</p>
              <button
                onClick={fetchAlerts}
                className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                {t('Retry', 'পুনরায় চেষ্টা করুন')}
              </button>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-20 h-20 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700 font-bold text-lg">{t('All crops are safe!', 'সব ফসল নিরাপদ!')}</p>
              <p className="text-sm text-gray-500 mt-2">{t('No critical alerts at this time', 'এই মুহূর্তে কোন জরুরি সতর্কতা নেই')}</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                <svg className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-bold">{t('SMS Simulation Active', 'এসএমএস সিমুলেশন সক্রিয়')}</p>
                  <p className="mt-1">{t('Critical alerts are being logged to browser console (F12)', 'জরুরি সতর্কতা ব্রাউজার কনসোলে লগ করা হচ্ছে (F12)')}</p>
                </div>
              </div>

              {/* Alerts List */}
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`border-l-4 rounded-lg p-5 ${getRiskColor(alert.riskLevel)} shadow-sm`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getRiskIcon(alert.riskLevel)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h3 className="font-bold text-xl">{alert.cropType}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white bg-opacity-60 whitespace-nowrap">
                          {alert.riskLevel}
                        </span>
                      </div>
                      <p className="text-base leading-relaxed mb-3 whitespace-pre-wrap">{alert.message}</p>
                      <p className="text-xs opacity-75 font-medium">
                        {new Date(alert.timestamp).toLocaleString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-gray-600 font-medium">
              {alerts.length > 0 
                ? t(`${alerts.length} alert(s) generated`, `${alerts.length}টি সতর্কতা তৈরি হয়েছে`)
                : t('No alerts', 'কোন সতর্কতা নেই')
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={fetchAlerts}
                disabled={loading}
                className="px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('Refresh', 'রিফ্রেশ')}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                {t('Close', 'বন্ধ করুন')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAlerts;

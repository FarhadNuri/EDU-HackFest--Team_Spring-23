import { useState, useEffect } from 'react'
import { cropAPI, predictionAPI, handleAPIError } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

const Analytics = ({ onClose }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cropData, setCropData] = useState([])
  const [predictions, setPredictions] = useState([])
  const [totalCrops, setTotalCrops] = useState(0)
  const [totalWeight, setTotalWeight] = useState(0)
  const [highRiskCount, setHighRiskCount] = useState(0)
  const { language, t } = useLanguage()

  const getCropNameInLanguage = (cropName) => {
    const cropTranslations = {
      'Rice': 'ধান',
      'Wheat': 'গম',
      'Corn': 'ভুট্টা',
      'Paddy': 'ধান',
      'Potato': 'আলু',
      'Tomato': 'টমেটো',
      'Onion': 'পেঁয়াজ',
      'Garlic': 'রসুন',
      'Vegetables': 'সবজি',
      'Others': 'অন্যান্য'
    }
    return language === 'bn' ? (cropTranslations[cropName] || cropName) : cropName
  }

  const getStorageTypeInLanguage = (storageType) => {
    const storageTranslations = {
      'Warehouse': 'গুদাম',
      'Cold Storage': 'হিমাগার',
      'Open Area': 'খোলা জায়গা',
      'Jute Bag Stack': 'পাটের বস্তার স্তূপ',
      'Silo': 'সাইলো',
      'Barn': 'শস্যাগার',
      'Container': 'কন্টেইনার',
      'Others': 'অন্যান্য'
    }
    return language === 'bn' ? (storageTranslations[storageType] || storageType) : storageType
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to load cached data first
      const cachedData = localStorage.getItem('analyticsData')
      if (cachedData) {
        const { crops, predictions: cachedPreds, timestamp } = JSON.parse(cachedData)
        // Use cache if less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setCropData(crops)
          setTotalCrops(crops.length)
          const weight = crops.reduce((sum, crop) => {
            const w = parseFloat(crop.weight) || 0
            return sum + w
          }, 0)
          setTotalWeight(weight)
          
          setPredictions(cachedPreds)
          const highRisk = cachedPreds.filter(p => 
            p.riskLevel === 'Critical' || p.riskLevel === 'High'
          ).length
          setHighRiskCount(highRisk)
          
          setLoading(false)
          
          // Still fetch fresh data in background if online
          if (!navigator.onLine) return
        }
      }
      
      const [cropsResponse, predictionsResponse] = await Promise.all([
        cropAPI.getAllCrops(),
        predictionAPI.getAllPredictions().catch(() => ({ data: { success: false, predictions: [] } }))
      ])

      if (cropsResponse.data.success) {
        const crops = cropsResponse.data.crops || []
        setCropData(crops)
        setTotalCrops(crops.length)
        
        const weight = crops.reduce((sum, crop) => {
          const w = parseFloat(crop.weight) || 0
          return sum + w
        }, 0)
        setTotalWeight(weight)
      }

      if (predictionsResponse.data.success) {
        const preds = predictionsResponse.data.predictions || []
        setPredictions(preds)
        
        const highRisk = preds.filter(p => 
          p.riskLevel === 'Critical' || p.riskLevel === 'High'
        ).length
        setHighRiskCount(highRisk)
      }
      
      // Cache the data
      localStorage.setItem('analyticsData', JSON.stringify({
        crops: cropsResponse.data.crops || [],
        predictions: predictionsResponse.data.predictions || [],
        timestamp: Date.now()
      }))
    } catch (err) {
      const errorInfo = handleAPIError(err)
      
      // If offline and we have cached data, use it
      if (!navigator.onLine) {
        const cachedData = localStorage.getItem('analyticsData')
        if (cachedData) {
          const { crops, predictions: cachedPreds } = JSON.parse(cachedData)
          setCropData(crops)
          setTotalCrops(crops.length)
          const weight = crops.reduce((sum, crop) => {
            const w = parseFloat(crop.weight) || 0
            return sum + w
          }, 0)
          setTotalWeight(weight)
          
          setPredictions(cachedPreds)
          const highRisk = cachedPreds.filter(p => 
            p.riskLevel === 'Critical' || p.riskLevel === 'High'
          ).length
          setHighRiskCount(highRisk)
          
          setError('Showing cached data (offline)')
        } else {
          setError(errorInfo.message)
        }
      } else {
        setError(errorInfo.message)
      }
      console.error('Analytics fetch error:', errorInfo)
    } finally {
      setLoading(false)
    }
  }

  const getCropTypeDistribution = () => {
    const distribution = {}
    cropData.forEach(crop => {
      const type = crop.cropType || 'Other'
      if (!distribution[type]) {
        distribution[type] = { count: 0, weight: 0 }
      }
      distribution[type].count++
      distribution[type].weight += parseFloat(crop.weight) || 0
    })
    return distribution
  }

  const getRiskDistribution = () => {
    const dist = { Critical: 0, High: 0, Medium: 0, Low: 0 }
    predictions.forEach(pred => {
      const level = pred.riskLevel || 'Low'
      dist[level] = (dist[level] || 0) + 1
    })
    return dist
  }

  const cropDistribution = getCropTypeDistribution()
  const riskDistribution = getRiskDistribution()

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full relative animate-fade-in-up my-4 sm:my-8 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center transition-all hover:scale-110 z-[100]"
          aria-label="Close"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('Analytics Dashboard', 'বিশ্লেষণ ড্যাশবোর্ড')}</h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={fetchAnalyticsData}
                className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">{t('Total Crops', 'মোট ফসল')}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCrops}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">{t('Total Weight', 'মোট ওজন')}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalWeight.toFixed(1)} {t('kg', 'কেজি')}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">{t('High Risk Crops', 'উচ্চ ঝুঁকিপূর্ণ ফসল')}</p>
                  <p className="text-2xl font-bold text-gray-900">{highRiskCount}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">{t('Safe Crops', 'নিরাপদ ফসল')}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCrops - highRiskCount}</p>
                </div>
              </div>
            </>
          )}

          {!loading && !error && (
            <>
              {/* Crop Type Distribution */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('Crop Type Distribution', 'ফসলের ধরন বিতরণ')}</h3>
                {Object.keys(cropDistribution).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(cropDistribution).map(([type, data], index) => {
                      const percentage = totalCrops > 0 ? ((data.count / totalCrops) * 100).toFixed(0) : 0
                      const colors = ['bg-lime-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-blue-500']
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{getCropNameInLanguage(type)}</span>
                            <span className="text-sm text-gray-600">
                              {data.weight.toFixed(1)} {t('kg', 'কেজি')} • {data.count} {t('crops', 'ফসল')} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`${colors[index % colors.length]} h-2.5 rounded-full transition-all`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">{t('No crop data available', 'কোন ফসল ডেটা উপলব্ধ নেই')}</p>
                )}
              </div>

              {/* Risk Level Distribution */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('Risk Level Distribution', 'ঝুঁকি স্তর বিতরণ')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center border-2 border-red-200">
                    <p className="text-2xl font-bold text-red-600">{riskDistribution.Critical || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('Critical', 'জরুরী')}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border-2 border-orange-200">
                    <p className="text-2xl font-bold text-orange-600">{riskDistribution.High || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('High', 'উচ্চ')}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border-2 border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-600">{riskDistribution.Medium || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('Medium', 'মধ্যম')}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border-2 border-green-200">
                    <p className="text-2xl font-bold text-green-600">{riskDistribution.Low || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('Low', 'নিম্ন')}</p>
                  </div>
                </div>
              </div>

              {/* Storage Types */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{t('Storage Types', 'সংরক্ষণের ধরন')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[...new Set(cropData.map(c => c.storageType))].map((type, idx) => {
                    const count = cropData.filter(c => c.storageType === type).length
                    return (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xl font-bold text-gray-900">{count}</p>
                        <p className="text-sm text-gray-600">{getStorageTypeInLanguage(type)}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {!loading && !error && (
            <div className="bg-lime-50 border-2 border-lime-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-lime-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-lime-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('Summary', 'সারসংক্ষেপ')}</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• {t(`Total of ${totalCrops} crops registered in storage`, `মোট ${totalCrops}টি ফসল সংরক্ষণে নিবন্ধিত`)}</li>
                    <li>• {highRiskCount > 0 
                      ? t(`${highRiskCount} crop${highRiskCount > 1 ? 's' : ''} require immediate attention`, `${highRiskCount}টি ফসল অবিলম্বে মনোযোগ প্রয়োজন`) 
                      : t('All crops are in good condition', 'সমস্ত ফসল ভাল অবস্থায় আছে')}</li>
                    <li>• {t(`Combined storage weight: ${totalWeight.toFixed(1)} kg`, `সম্মিলিত সংরক্ষণ ওজন: ${totalWeight.toFixed(1)} কেজি`)}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics

import { useState, useEffect } from 'react'
import { predictionAPI, handleAPIError } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

const Alerts = ({ onClose, onCropSelect }) => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviewedAlerts, setReviewedAlerts] = useState(() => {
    const saved = localStorage.getItem('reviewedAlerts')
    return saved ? new Set(JSON.parse(saved)) : new Set()
  })
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

  useEffect(() => {
    fetchAlerts()
  }, [])

  const handleViewDetails = (alert) => {
    if (onCropSelect) {
      onCropSelect({ 
        _id: alert.id, 
        cropType: alert.crop, 
        storageType: alert.storageType, 
        storageLocation: alert.location,
        weight: alert.weight,
        quantity: alert.weight
      })
    }
    onClose()
  }

  const handleMarkAsReviewed = (alertId) => {
    setReviewedAlerts(prev => {
      const updated = new Set([...prev, alertId])
      localStorage.setItem('reviewedAlerts', JSON.stringify([...updated]))
      return updated
    })
  }

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      
      // Try to load cached alerts first
      const cachedAlerts = localStorage.getItem('alertsData')
      if (cachedAlerts) {
        const { alerts: cachedData, timestamp } = JSON.parse(cachedAlerts)
        // Use cache if less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setAlerts(cachedData)
          setLoading(false)
          
          // Still fetch fresh data in background if online
          if (!navigator.onLine) return
        }
      }
      
      const response = await predictionAPI.getAllPredictions()
      
      if (response.data.success) {
        const predictions = response.data.predictions || []
        const transformedAlerts = predictions.map((pred) => {
          const riskLevel = pred.riskLevel
          const cropType = pred.crop.type
          const storageType = pred.crop.storageType
          const location = pred.crop.storageLocation || 'Storage Location'
          const etcl = pred.etcl
          
          // Determine alert type based on risk level
          let type = 'success'
          let severity = 'low'
          if (riskLevel === 'Critical') {
            type = 'warning'
            severity = 'high'
          } else if (riskLevel === 'High') {
            type = 'warning'
            severity = 'high'
          } else if (riskLevel === 'Medium') {
            type = 'info'
            severity = 'medium'
          }

          // Create appropriate messages
          let title, titleBengali, message, messageBengali
          
          // Get Bengali crop name
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
          const cropNameBengali = cropTranslations[cropType] || cropType
          
          if (riskLevel === 'Critical' || riskLevel === 'High') {
            title = `${riskLevel} Risk Alert for ${cropType}`
            titleBengali = `${cropNameBengali} এর জন্য ${riskLevel === 'Critical' ? 'জরুরী' : 'উচ্চ'} ঝুঁকি সতর্কতা`
            message = `${pred.summary || `Storage conditions require immediate attention. Estimated time to critical loss: ${etcl}`}`
            messageBengali = `সংরক্ষণ অবস্থা অবিলম্বে মনোযোগ প্রয়োজন। ক্ষতির সময়: ${etcl}`
          } else if (riskLevel === 'Medium') {
            title = `Monitoring Required for ${cropType}`
            titleBengali = `${cropNameBengali} এর জন্য পর্যবেক্ষণ প্রয়োজন`
            message = pred.summary || `Storage conditions should be monitored. Estimated safe storage: ${etcl}`
            messageBengali = `সংরক্ষণ অবস্থা পর্যবেক্ষণ করুন। নিরাপদ সংরক্ষণ: ${etcl}`
          } else {
            title = `Storage Conditions Optimal for ${cropType}`
            titleBengali = `${cropNameBengali} এর সংরক্ষণ অবস্থা সর্বোত্তম`
            message = pred.summary || `Storage conditions are within optimal range. Safe storage time: ${etcl}`
            messageBengali = `সংরক্ষণ অবস্থা সর্বোত্তম সীমার মধ্যে। নিরাপদ সময়: ${etcl}`
          }

          return {
            id: pred.crop.id,
            type,
            title,
            titleBengali,
            message,
            messageBengali,
            crop: cropType,
            location,
            storageType,
            weight: pred.crop.weight,
            time: pred.timeframe || 'Recently',
            severity,
            riskLevel,
            etcl,
            riskScore: pred.riskScore
          }
        })

        setAlerts(transformedAlerts)
        
        // Cache the alerts data
        localStorage.setItem('alertsData', JSON.stringify({
          alerts: transformedAlerts,
          timestamp: Date.now()
        }))
      }
    } catch (err) {
      const errorInfo = handleAPIError(err)
      
      // If offline and we have cached data, use it
      if (!navigator.onLine) {
        const cachedAlerts = localStorage.getItem('alertsData')
        if (cachedAlerts) {
          const { alerts: cachedData } = JSON.parse(cachedAlerts)
          setAlerts(cachedData)
          setError('Showing cached alerts (offline)')
        } else {
          setError(errorInfo.message)
        }
      } else {
        setError(errorInfo.message)
      }
      console.error('Error fetching alerts:', errorInfo)
    } finally {
      setLoading(false)
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getAlertStyles = (type) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-700'
        }
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-700'
        }
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          badge: 'bg-green-100 text-green-700'
        }
      default:
        return {}
    }
  }

  // Calculate alert counts
  const highRiskCount = alerts.filter(a => a.severity === 'high').length
  const mediumRiskCount = alerts.filter(a => a.severity === 'medium').length
  const lowRiskCount = alerts.filter(a => a.severity === 'low').length

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full relative animate-fade-in-up my-4 sm:my-8 max-h-[95vh] overflow-y-auto"
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
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('Alerts & Notifications', 'সতর্কতা এবং বিজ্ঞপ্তি')}</h2>
          </div>

          {/* Alert Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-600">{highRiskCount}</p>
              <p className="text-xs text-gray-600">{t('High Priority', 'উচ্চ অগ্রাধিকার')}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{mediumRiskCount}</p>
              <p className="text-xs text-gray-600">{t('Medium', 'মধ্যম')}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{lowRiskCount}</p>
              <p className="text-xs text-gray-600">{t('Optimal', 'সর্বোত্তম')}</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={fetchAlerts}
                className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                {t('Try Again', 'পুনরায় চেষ্টা করুন')}
              </button>
            </div>
          )}

          {/* No Alerts State */}
          {!loading && !error && alerts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600">{t('No alerts at this time', 'এই মুহূর্তে কোন সতর্কতা নেই')}</p>
            </div>
          )}

          {/* Alerts List */}
          <div className="space-y-4">
            {alerts.map((alert) => {
              const styles = getAlertStyles(alert.type)
              return (
                <div 
                  key={alert.id}
                  className={`${styles.bg} ${styles.border} border-2 rounded-xl p-4 transition-all hover:shadow-md`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${styles.iconBg} ${styles.iconColor} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{language === 'bn' ? alert.titleBengali : alert.title}</h3>
                        </div>
                        <span className={`${styles.badge} px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0`}>
                          {alert.severity}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{language === 'bn' ? alert.messageBengali : alert.message}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span>{getCropNameInLanguage(alert.crop)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{alert.time}</span>
                        </div>
                      </div>
                      
                      {/* Risk Score Badge */}
                      {alert.riskScore && (
                        <div className="mt-2 inline-block">
                          <span className="text-xs text-gray-500">{t('Risk Score:', 'ঝুঁকির স্কোর:')} </span>
                          <span className={`text-xs font-bold ${
                            alert.riskScore >= 70 ? 'text-red-600' :
                            alert.riskScore >= 40 ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            {alert.riskScore}/100
                          </span>
                        </div>
                      )}

                      {(alert.type === 'warning' || alert.severity === 'high') && !reviewedAlerts.has(alert.id) && (
                        <div className="mt-3 flex gap-2">
                          <button 
                            className="px-3 py-1.5 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition"
                            onClick={() => handleViewDetails(alert)}
                          >
                            {t('View Details', 'বিস্তারিত দেখুন')}
                          </button>
                          <button 
                            className="px-3 py-1.5 bg-white text-gray-700 text-xs rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                            onClick={() => handleMarkAsReviewed(alert.id)}
                          >
                            {t('Mark as Reviewed', 'পর্যালোচিত হিসাবে চিহ্নিত করুন')}
                          </button>
                        </div>
                      )}
                      {reviewedAlerts.has(alert.id) && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {t('Reviewed', 'পর্যালোচিত')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <button 
              onClick={fetchAlerts}
              className="text-sm text-lime-600 hover:text-lime-700 font-medium"
            >
              {t('Refresh Alerts', 'সতর্কতা রিফ্রেশ করুন')} →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts

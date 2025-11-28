import { useState } from 'react'

const Alerts = ({ onClose }) => {
  const [alerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'High Temperature Alert',
      titleBengali: 'উচ্চ তাপমাত্রা সতর্কতা',
      message: 'Storage temperature for Rice BR-28 has exceeded optimal range (32°C)',
      messageBengali: 'ধান BR-28 এর সংরক্ষণ তাপমাত্রা সর্বোত্তম সীমা অতিক্রম করেছে (৩২°সে)',
      crop: 'Rice BR-28',
      location: 'Warehouse A',
      time: '2 hours ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'Humidity Check Required',
      titleBengali: 'আর্দ্রতা পরীক্ষা প্রয়োজন',
      message: 'Please check humidity levels for Wheat storage',
      messageBengali: 'গম সংরক্ষণের জন্য আর্দ্রতার মাত্রা পরীক্ষা করুন',
      crop: 'Wheat',
      location: 'Warehouse B',
      time: '5 hours ago',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'Storage Conditions Optimal',
      titleBengali: 'সংরক্ষণ অবস্থা সর্বোত্তম',
      message: 'Potato storage conditions are within optimal range',
      messageBengali: 'আলু সংরক্ষণের অবস্থা সর্বোত্তম সীমার মধ্যে রয়েছে',
      crop: 'Potato',
      location: 'Cold Storage',
      time: '1 day ago',
      severity: 'low'
    }
  ])

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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Alerts & Notifications</h2>
            <p className="text-sm sm:text-base text-gray-600 font-bengali">সতর্কতা এবং বিজ্ঞপ্তি</p>
          </div>

          {/* Alert Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-600">1</p>
              <p className="text-xs text-gray-600">High Priority</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">1</p>
              <p className="text-xs text-gray-600">Medium</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">1</p>
              <p className="text-xs text-gray-600">Resolved</p>
            </div>
          </div>

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
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{alert.title}</h3>
                          <p className="text-xs text-gray-600 font-bengali">{alert.titleBengali}</p>
                        </div>
                        <span className={`${styles.badge} px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0`}>
                          {alert.severity}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-1">{alert.message}</p>
                      <p className="text-xs text-gray-600 font-bengali mb-3">{alert.messageBengali}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span>{alert.crop}</span>
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
                      
                      {alert.type === 'warning' && (
                        <div className="mt-3 flex gap-2">
                          <button className="px-3 py-1.5 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition">
                            Take Action
                          </button>
                          <button className="px-3 py-1.5 bg-white text-gray-700 text-xs rounded-lg border border-gray-300 hover:bg-gray-50 transition">
                            Dismiss
                          </button>
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
            <button className="text-sm text-lime-600 hover:text-lime-700 font-medium">
              View All Notifications →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts

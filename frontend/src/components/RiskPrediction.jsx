import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const RiskPrediction = ({ onClose, cropData }) => {
  const { language, t } = useLanguage()
  const [riskAnalysis, setRiskAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock sensor data
  const sensorData = {
    currentTemp: 32,
    currentHumidity: 78,
    avgTemp7Days: 31,
    avgHumidity7Days: 75,
    highTempDays: 4,
    highHumidityDays: 5
  }

  // Mock 7-day weather forecast
  const weatherForecast = [
    { day: 1, temp: 33, humidity: 80, rain: 85 },
    { day: 2, temp: 32, humidity: 82, rain: 90 },
    { day: 3, temp: 31, humidity: 78, rain: 70 },
    { day: 4, temp: 34, humidity: 75, rain: 40 },
    { day: 5, temp: 35, humidity: 72, rain: 30 },
    { day: 6, temp: 36, humidity: 70, rain: 20 },
    { day: 7, temp: 34, humidity: 73, rain: 35 }
  ]

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return String(num).split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('')
  }

  useEffect(() => {
    // Simulate risk calculation
    setTimeout(() => {
      const analysis = calculateRisk()
      setRiskAnalysis(analysis)
      setLoading(false)
    }, 800)
  }, [])

  const calculateRisk = () => {
    let etclHours = 168 // Default 7 days
    let riskLevel = 'Low'
    let riskColor = 'green'
    let riskType = 'General Storage Risk'
    let riskTypeBn = 'সাধারণ সংরক্ষণ ঝুঁকি'

    // Calculate ETCL based on temperature and humidity
    if (sensorData.currentTemp >= 32 && sensorData.currentHumidity >= 75) {
      etclHours = 72 // 3 days
      riskLevel = 'High'
      riskColor = 'red'
      riskType = 'Aflatoxin Mold Risk'
      riskTypeBn = 'আফলাটক্সিন ছত্রাকের ঝুঁকি'
    } else if (sensorData.currentTemp >= 30 && sensorData.currentHumidity >= 70) {
      etclHours = 120 // 5 days
      riskLevel = 'Medium'
      riskColor = 'orange'
      riskType = 'Fungal Growth Risk'
      riskTypeBn = 'ছত্রাক বৃদ্ধির ঝুঁকি'
    }

    // Adjust ETCL based on weather forecast
    const highRainDays = weatherForecast.filter(d => d.rain >= 70).length
    const highHumidityDays = weatherForecast.filter(d => d.humidity >= 75).length
    
    if (highRainDays >= 3) {
      etclHours = Math.max(24, etclHours - 48) // Reduce by 2 days, minimum 1 day
    }

    // Generate recommendations
    const recommendations = []
    
    if (highRainDays >= 3) {
      recommendations.push({
        icon: 'rain',
        textEn: 'High rainfall predicted. Avoid outdoor drying.',
        textBn: 'উচ্চ বৃষ্টিপাতের পূর্বাভাস। বাইরে শুকানো এড়িয়ে চলুন।',
        priority: 'high'
      })
    }

    if (sensorData.currentHumidity >= 75) {
      recommendations.push({
        icon: 'humidity',
        textEn: 'High humidity detected. Indoor aeration required immediately.',
        textBn: 'উচ্চ আর্দ্রতা সনাক্ত। অবিলম্বে ঘরের ভিতরে বায়ুচলাচল প্রয়োজন।',
        priority: 'high'
      })
    }

    if (weatherForecast[5].temp >= 35) {
      recommendations.push({
        icon: 'temp',
        textEn: 'High temperature expected in 5-6 days. Plan harvest accordingly.',
        textBn: '৫-৬ দিনে উচ্চ তাপমাত্রা প্রত্যাশিত। সেই অনুযায়ী ফসল কাটার পরিকল্পনা করুন।',
        priority: 'medium'
      })
    }

    if (etclHours <= 72) {
      recommendations.push({
        icon: 'urgent',
        textEn: 'Critical: Take action within 72 hours to prevent loss.',
        textBn: 'জরুরি: ক্ষতি রোধে ৭২ ঘন্টার মধ্যে ব্যবস্থা নিন।',
        priority: 'urgent'
      })
    }

    return {
      etclHours,
      etclDays: Math.floor(etclHours / 24),
      riskLevel,
      riskColor,
      riskType,
      riskTypeBn,
      recommendations,
      weatherImpact: highRainDays >= 3 ? 'negative' : 'neutral'
    }
  }

  const getRiskIcon = (icon) => {
    switch (icon) {
      case 'rain':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        )
      case 'humidity':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
        )
      case 'temp':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      case 'urgent':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 14h-2V9h2m0 9h-2v-2h2M1 21h22L12 2 1 21z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-300 text-red-900'
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-900'
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900'
      default:
        return 'bg-blue-100 border-blue-300 text-blue-900'
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full relative animate-fade-in-up my-4 sm:my-8 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center transition-all hover:scale-110 z-[100]"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Risk Prediction & ETCL', 'ঝুঁকি পূর্বাভাস এবং ETCL')}
            </h2>
            <p className={`text-sm sm:text-base text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Estimated Time to Critical Loss', 'সংকটজনক ক্ষতির আনুমানিক সময়')}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className={`mt-4 text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Analyzing risk factors...', 'ঝুঁকির কারণ বিশ্লেষণ করা হচ্ছে...')}
              </p>
            </div>
          ) : riskAnalysis && (
            <>
              {/* ETCL Summary Card */}
              <div className={`bg-gradient-to-br from-${riskAnalysis.riskColor}-500 to-${riskAnalysis.riskColor}-600 rounded-xl p-6 text-white mb-6`}
                   style={{
                     background: riskAnalysis.riskColor === 'red' 
                       ? 'linear-gradient(to bottom right, #ef4444, #dc2626)'
                       : riskAnalysis.riskColor === 'orange'
                       ? 'linear-gradient(to bottom right, #f97316, #ea580c)'
                       : 'linear-gradient(to bottom right, #22c55e, #16a34a)'
                   }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-sm opacity-90 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Risk Level', 'ঝুঁকির মাত্রা')}
                    </p>
                    <h3 className={`text-3xl font-bold ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t(riskAnalysis.riskLevel, riskAnalysis.riskLevel === 'High' ? 'উচ্চ' : riskAnalysis.riskLevel === 'Medium' ? 'মাঝারি' : 'নিম্ন')}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm opacity-90 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>ETCL</p>
                    <p className={`text-4xl font-bold ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? toBengaliNumber(riskAnalysis.etclDays) : riskAnalysis.etclDays}
                    </p>
                    <p className={`text-sm opacity-90 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('days', 'দিন')}
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <p className={`text-lg font-semibold ${language === 'bn' ? 'font-bengali text-xl' : ''}`}>
                    {language === 'bn' ? riskAnalysis.riskTypeBn : riskAnalysis.riskType}
                  </p>
                </div>
              </div>

              {/* Current Conditions */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className={`text-lg font-bold text-gray-900 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Current Storage Conditions', 'বর্তমান সংরক্ষণ অবস্থা')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className={`text-sm font-medium text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {t('Temperature', 'তাপমাত্রা')}
                      </span>
                    </div>
                    <p className={`text-2xl font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? toBengaliNumber(sensorData.currentTemp) : sensorData.currentTemp}°C
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                      </svg>
                      <span className={`text-sm font-medium text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {t('Humidity', 'আর্দ্রতা')}
                      </span>
                    </div>
                    <p className={`text-2xl font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? toBengaliNumber(sensorData.currentHumidity) : sensorData.currentHumidity}%
                    </p>
                  </div>
                </div>
              </div>

              {/* 7-Day Weather Forecast */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className={`text-lg font-bold text-gray-900 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('7-Day Weather Forecast Impact', '৭ দিনের আবহাওয়া পূর্বাভাসের প্রভাব')}
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {weatherForecast.map((day, index) => (
                    <div key={index} className="bg-white rounded-lg p-2 text-center">
                      <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {t(`Day ${day.day}`, `দিন ${language === 'bn' ? toBengaliNumber(day.day) : day.day}`)}
                      </p>
                      <p className={`text-sm font-bold ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? toBengaliNumber(day.temp) : day.temp}°
                      </p>
                      <p className={`text-xs ${day.rain >= 70 ? 'text-orange-600' : 'text-blue-600'} ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? toBengaliNumber(day.rain) : day.rain}%
                      </p>
                    </div>
                  ))}
                </div>
                {riskAnalysis.weatherImpact === 'negative' && (
                  <div className="mt-4 bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
                    <p className={`text-sm text-orange-800 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t(
                        '⚠️ Weather forecast suggests high humidity and rainfall, increasing risk.',
                        '⚠️ আবহাওয়ার পূর্বাভাস উচ্চ আর্দ্রতা এবং বৃষ্টিপাতের ইঙ্গিত দেয়, ঝুঁকি বৃদ্ধি করছে।'
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div>
                <h3 className={`text-lg font-bold text-gray-900 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Recommended Actions', 'প্রস্তাবিত পদক্ষেপ')}
                </h3>
                <div className="space-y-3">
                  {riskAnalysis.recommendations.map((rec, index) => (
                    <div 
                      key={index}
                      className={`${getPriorityColor(rec.priority)} border-2 rounded-xl p-4`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 ${rec.priority === 'urgent' ? 'text-red-600' : rec.priority === 'high' ? 'text-orange-600' : 'text-yellow-600'}`}>
                          {getRiskIcon(rec.icon)}
                        </div>
                        <p className={`text-sm leading-relaxed flex-1 ${language === 'bn' ? 'font-bengali text-base' : ''}`}>
                          {language === 'bn' ? rec.textBn : rec.textEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Summary */}
              <div className="mt-6 bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h4 className={`font-bold text-purple-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Risk Summary', 'ঝুঁকির সারসংক্ষেপ')}
                    </h4>
                    <p className={`text-sm text-purple-800 leading-relaxed ${language === 'bn' ? 'font-bengali text-base' : ''}`}>
                      {language === 'bn' 
                        ? `${riskAnalysis.riskTypeBn} (ETCL: ${toBengaliNumber(riskAnalysis.etclHours)} ঘন্টা)। আবহাওয়ার পূর্বাভাস উচ্চ আর্দ্রতার পরামর্শ দেয়, ঘরের ভিতরে বায়ুচলাচল প্রয়োজন।`
                        : `${riskAnalysis.riskType} (ETCL: ${riskAnalysis.etclHours} hours). Weather forecast suggests high humidity, requiring indoor aeration.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RiskPrediction

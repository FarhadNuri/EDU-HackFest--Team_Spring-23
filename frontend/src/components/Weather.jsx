import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const Weather = ({ onClose }) => {
  const { language, t } = useLanguage()
  const [selectedUpazila, setSelectedUpazila] = useState('Dhaka')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Sample Upazila list (can be expanded)
  const upazilas = [
    { name: 'Dhaka', nameBn: 'ঢাকা' },
    { name: 'Chittagong', nameBn: 'চট্টগ্রাম' },
    { name: 'Rajshahi', nameBn: 'রাজশাহী' },
    { name: 'Khulna', nameBn: 'খুলনা' },
    { name: 'Sylhet', nameBn: 'সিলেট' },
    { name: 'Barisal', nameBn: 'বরিশাল' },
    { name: 'Rangpur', nameBn: 'রংপুর' },
    { name: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
    { name: 'Comilla', nameBn: 'কুমিল্লা' },
    { name: 'Bogra', nameBn: 'বগুড়া' }
  ]

  // Mock weather data (in production, fetch from OpenWeatherMap API)
  const mockWeatherData = {
    location: selectedUpazila,
    current: {
      temp: 32,
      humidity: 75,
      condition: 'Partly Cloudy',
      conditionBn: 'আংশিক মেঘলা'
    },
    forecast: [
      { day: 'Today', dayBn: 'আজ', temp: 32, humidity: 75, rain: 85, condition: 'rainy' },
      { day: 'Tomorrow', dayBn: 'আগামীকাল', temp: 31, humidity: 80, rain: 90, condition: 'rainy' },
      { day: 'Day 3', dayBn: 'পরশু', temp: 30, humidity: 78, rain: 70, condition: 'stormy' },
      { day: 'Day 4', dayBn: '৪ দিন', temp: 33, humidity: 65, rain: 30, condition: 'cloudy' },
      { day: 'Day 5', dayBn: '৫ দিন', temp: 35, humidity: 60, rain: 20, condition: 'sunny' }
    ]
  }

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return (
          <svg className="w-10 h-10 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      case 'cloudy':
        return (
          <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        )
      case 'rainy':
        return (
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 19l-1 2m4-2l-1 2m4-2l-1 2m4-2l-1 2" />
          </svg>
        )
      case 'stormy':
        return (
          <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10l-3 6h4l-3 6" />
          </svg>
        )
      default:
        return (
          <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        )
    }
  }

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setWeatherData(mockWeatherData)
      setLoading(false)
    }, 500)
  }, [selectedUpazila])

  // Generate advisories based on weather and crop data
  const getAdvisories = () => {
    if (!weatherData) return []

    const advisories = []
    const forecast = weatherData.forecast

    // High rain advisory
    if (forecast[0].rain >= 80 || forecast[1].rain >= 80 || forecast[2].rain >= 80) {
      advisories.push({
        type: 'warning',
        titleEn: 'Heavy Rain Alert',
        titleBn: 'ভারী বৃষ্টির সতর্কতা',
        messageEn: `Rain expected ${forecast[0].rain}% in next 3 days → Harvest rice today or cover it`,
        messageBn: `আগামী ৩ দিন বৃষ্টি ${forecast[0].rain}% → আজই ধান কাটুন অথবা ঢেকে রাখুন`,
        color: 'orange'
      })
    }

    // High temperature advisory
    if (forecast[3].temp >= 35 || forecast[4].temp >= 35) {
      advisories.push({
        type: 'info',
        titleEn: 'High Temperature Warning',
        titleBn: 'উচ্চ তাপমাত্রার সতর্কতা',
        messageEn: `Temperature will rise to ${forecast[4].temp}°C → Water vegetables in the afternoon`,
        messageBn: `তাপমাত্রা ${forecast[4].temp}°C উঠবে → দুপুরের দিকে সেচ দিন`,
        color: 'red'
      })
    }

    // High humidity advisory
    if (forecast[1].humidity >= 80) {
      advisories.push({
        type: 'caution',
        titleEn: 'High Humidity Alert',
        titleBn: 'উচ্চ আর্দ্রতার সতর্কতা',
        messageEn: `Humidity ${forecast[1].humidity}% → Risk of fungus, check stored crops`,
        messageBn: `আর্দ্রতা ${forecast[1].humidity}% → ফাংগাসের ঝুঁকি, সংরক্ষিত ফসল পরীক্ষা করুন`,
        color: 'blue'
      })
    }

    // Good weather advisory
    if (forecast[3].rain <= 30 && forecast[3].temp <= 33) {
      advisories.push({
        type: 'success',
        titleEn: 'Good Weather Ahead',
        titleBn: 'ভালো আবহাওয়া আসছে',
        messageEn: 'Day 4-5 will be good → Best time for harvesting',
        messageBn: '৪-৫ দিন ভালো থাকবে → ফসল কাটার সেরা সময়',
        color: 'green'
      })
    }

    return advisories
  }

  const advisories = getAdvisories()

  const getColorClasses = (color) => {
    const colors = {
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      red: 'bg-red-50 border-red-200 text-red-900',
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900'
    }
    return colors[color] || colors.blue
  }

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return String(num).split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('')
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Weather Forecast', 'আবহাওয়ার পূর্বাভাস')}
            </h2>
            <p className={`text-sm sm:text-base text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('5-Day Hyper-Local Weather', '৫ দিনের স্থানীয় আবহাওয়া')}
            </p>
          </div>

          {/* Upazila Selector */}
          <div className="mb-6">
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Select Your Upazila', 'আপনার উপজেলা নির্বাচন করুন')}
            </label>
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${language === 'bn' ? 'font-bengali' : ''}`}
            >
              {upazilas.map((upazila) => (
                <option key={upazila.name} value={upazila.name}>
                  {language === 'bn' ? upazila.nameBn : upazila.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-4 text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Loading weather data...', 'আবহাওয়ার তথ্য লোড হচ্ছে...')}
              </p>
            </div>
          ) : weatherData && (
            <>
              {/* Current Weather */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-lg mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' 
                        ? upazilas.find(u => u.name === weatherData.location)?.nameBn 
                        : weatherData.location}
                    </p>
                    <p className={`text-5xl font-bold ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? toBengaliNumber(weatherData.current.temp) : weatherData.current.temp}°C
                    </p>
                    <p className={`text-blue-100 mt-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? weatherData.current.conditionBn : weatherData.current.condition}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div className="flex items-center justify-end space-x-1">
                      <svg className="w-4 h-4 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.5 2a.5.5 0 01.5.5V3h8v-.5a.5.5 0 011 0V3h1.5A1.5 1.5 0 0118 4.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5v-11A1.5 1.5 0 013.5 3H5v-.5a.5.5 0 01.5-.5zM3 6v9.5a.5.5 0 00.5.5h13a.5.5 0 00.5-.5V6H3z" clipRule="evenodd" />
                      </svg>
                      <p className={`text-sm text-blue-100 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {t('Humidity', 'আর্দ্রতা')}: {language === 'bn' ? toBengaliNumber(weatherData.current.humidity) : weatherData.current.humidity}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="mb-6">
                <h3 className={`text-lg font-bold text-gray-900 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('5-Day Forecast', '৫ দিনের পূর্বাভাস')}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {weatherData.forecast.map((day, index) => (
                    <div 
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition"
                    >
                      <p className={`text-sm font-medium text-gray-700 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? day.dayBn : day.day}
                      </p>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className={`text-xl font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? toBengaliNumber(day.temp) : day.temp}°C
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-center space-x-1">
                          <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.5 2a.5.5 0 01.5.5V3h8v-.5a.5.5 0 011 0V3h1.5A1.5 1.5 0 0118 4.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5v-11A1.5 1.5 0 013.5 3H5v-.5a.5.5 0 01.5-.5zM3 6v9.5a.5.5 0 00.5.5h13a.5.5 0 00.5-.5V6H3z" clipRule="evenodd" />
                          </svg>
                          <p className={`text-xs text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {language === 'bn' ? toBengaliNumber(day.humidity) : day.humidity}%
                          </p>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                          <svg className={`w-3 h-3 ${day.rain >= 70 ? 'text-orange-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          </svg>
                          <p className={`text-xs font-semibold ${day.rain >= 70 ? 'text-orange-600' : 'text-blue-600'} ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {language === 'bn' ? toBengaliNumber(day.rain) : day.rain}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Advisories */}
              <div>
                <h3 className={`text-lg font-bold text-gray-900 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Weather Advisories', 'আবহাওয়া পরামর্শ')}
                </h3>
                <div className="space-y-3">
                  {advisories.map((advisory, index) => (
                    <div 
                      key={index}
                      className={`${getColorClasses(advisory.color)} border-2 rounded-xl p-4 transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {advisory.type === 'warning' && (
                            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                              <svg className="w-7 h-7 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                          )}
                          {advisory.type === 'info' && (
                            <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                              <svg className="w-7 h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </div>
                          )}
                          {advisory.type === 'caution' && (
                            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                              <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                              </svg>
                            </div>
                          )}
                          {advisory.type === 'success' && (
                            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                              <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-base mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {language === 'bn' ? advisory.titleBn : advisory.titleEn}
                          </h4>
                          <p className={`text-sm leading-relaxed ${language === 'bn' ? 'font-bengali text-lg' : ''}`}>
                            {language === 'bn' ? advisory.messageBn : advisory.messageEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                  <p className={`text-xs text-gray-500 text-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {t(
                      'Powered by OpenWeatherMap • Updated every hour',
                      'OpenWeatherMap দ্বারা চালিত • প্রতি ঘন্টায় আপডেট'
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Weather

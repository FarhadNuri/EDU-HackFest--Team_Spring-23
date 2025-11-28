import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const Analytics = ({ onClose }) => {
  const { language, t } = useLanguage()
  const [timeRange, setTimeRange] = useState('month')

  const stats = {
    totalCrops: 12,
    totalQuantity: '2.4 tons',
    successRate: 95,
    lossRate: 5,
    avgStorageDays: 45,
    alertsResolved: 28
  }

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return String(num).split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('')
  }

  const cropData = [
    { name: 'Rice', nameBn: 'ধান', quantity: 800, percentage: 33, color: 'bg-lime-500' },
    { name: 'Wheat', nameBn: 'গম', quantity: 600, percentage: 25, color: 'bg-green-500' },
    { name: 'Potato', nameBn: 'আলু', quantity: 500, percentage: 21, color: 'bg-yellow-500' },
    { name: 'Vegetables', nameBn: 'সবজি', quantity: 300, percentage: 13, color: 'bg-orange-500' },
    { name: 'Others', nameBn: 'অন্যান্য', quantity: 200, percentage: 8, color: 'bg-blue-500' }
  ]

  const weeklyData = [
    { label: 'Mon', labelBn: 'সোম', saved: 88, lost: 12 },
    { label: 'Tue', labelBn: 'মঙ্গল', saved: 90, lost: 10 },
    { label: 'Wed', labelBn: 'বুধ', saved: 85, lost: 15 },
    { label: 'Thu', labelBn: 'বৃহঃ', saved: 92, lost: 8 },
    { label: 'Fri', labelBn: 'শুক্র', saved: 87, lost: 13 },
    { label: 'Sat', labelBn: 'শনি', saved: 95, lost: 5 },
    { label: 'Sun', labelBn: 'রবি', saved: 93, lost: 7 }
  ]

  const monthlyData = [
    { label: 'Jan', labelBn: 'জানু', saved: 85, lost: 15 },
    { label: 'Feb', labelBn: 'ফেব্রু', saved: 88, lost: 12 },
    { label: 'Mar', labelBn: 'মার্চ', saved: 92, lost: 8 },
    { label: 'Apr', labelBn: 'এপ্রিল', saved: 95, lost: 5 },
    { label: 'May', labelBn: 'মে', saved: 93, lost: 7 },
    { label: 'Jun', labelBn: 'জুন', saved: 96, lost: 4 },
    { label: 'Jul', labelBn: 'জুলাই', saved: 94, lost: 6 },
    { label: 'Aug', labelBn: 'আগস্ট', saved: 91, lost: 9 },
    { label: 'Sep', labelBn: 'সেপ্টে', saved: 89, lost: 11 },
    { label: 'Oct', labelBn: 'অক্টো', saved: 90, lost: 10 },
    { label: 'Nov', labelBn: 'নভে', saved: 92, lost: 8 },
    { label: 'Dec', labelBn: 'ডিসে', saved: 94, lost: 6 }
  ]

  const yearlyData = [
    { label: '2019', labelBn: '২০১৯', saved: 82, lost: 18 },
    { label: '2020', labelBn: '২০২০', saved: 85, lost: 15 },
    { label: '2021', labelBn: '২০২১', saved: 88, lost: 12 },
    { label: '2022', labelBn: '২০২২', saved: 91, lost: 9 },
    { label: '2023', labelBn: '২০২৩', saved: 93, lost: 7 },
    { label: '2024', labelBn: '২০২৪', saved: 95, lost: 5 }
  ]

  const getChartData = () => {
    if (timeRange === 'week') return weeklyData
    if (timeRange === 'year') return yearlyData
    return monthlyData
  }

  const chartData = getChartData()

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
            <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Analytics Dashboard', 'বিশ্লেষণ ড্যাশবোর্ড')}
            </h2>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-center gap-2 mb-6">
            {[
              { value: 'week', en: 'Week', bn: 'সপ্তাহ' },
              { value: 'month', en: 'Month', bn: 'মাস' },
              { value: 'year', en: 'Year', bn: 'বছর' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${language === 'bn' ? 'font-bengali' : ''} ${
                  timeRange === range.value
                    ? 'bg-lime-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'bn' ? range.bn : range.en}
              </button>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-xl p-4 border-2 border-lime-200 hover:border-lime-300 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-lime-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-lime-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Total Crops', 'মোট ফসল')}
              </p>
              <p className={`text-3xl font-bold text-lime-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? toBengaliNumber(stats.totalCrops) : stats.totalCrops}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 hover:border-blue-300 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
              </div>
              <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Total Quantity', 'মোট পরিমাণ')}
              </p>
              <p className={`text-3xl font-bold text-blue-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? '২.৪' : '2.4'}
              </p>
              <p className={`text-xs text-blue-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('tons', 'টন')}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200 hover:border-green-300 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Success Rate', 'সফলতার হার')}
              </p>
              <p className={`text-3xl font-bold text-green-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? toBengaliNumber(stats.successRate) : stats.successRate}%
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200 hover:border-orange-300 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Loss Rate', 'ক্ষতির হার')}
              </p>
              <p className={`text-3xl font-bold text-orange-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? toBengaliNumber(stats.lossRate) : stats.lossRate}%
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200 hover:border-purple-300 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Avg Storage', 'গড় সংরক্ষণ')}
              </p>
              <p className={`text-3xl font-bold text-purple-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? toBengaliNumber(stats.avgStorageDays) : stats.avgStorageDays}
              </p>
              <p className={`text-xs text-purple-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('days', 'দিন')}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border-2 border-pink-200 hover:border-pink-300 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-pink-200 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Alerts Resolved', 'সমাধান সতর্কতা')}
              </p>
              <p className={`text-3xl font-bold text-pink-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {language === 'bn' ? toBengaliNumber(stats.alertsResolved) : stats.alertsResolved}
              </p>
            </div>
          </div>

          {/* Crop Distribution */}
          <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-lime-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className={`text-lg font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Crop Distribution', 'ফসল বিতরণ')}
              </h3>
            </div>
            <div className="space-y-4">
              {cropData.map((crop, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${crop.color} rounded-full`}></div>
                      <span className={`text-sm font-semibold text-gray-800 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? crop.nameBn : crop.name}
                      </span>
                    </div>
                    <span className={`text-sm font-bold text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? toBengaliNumber(crop.percentage) : crop.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div 
                      className={`${crop.color} h-3 rounded-full transition-all duration-500 shadow-sm`}
                      style={{ width: `${crop.percentage}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {language === 'bn' ? toBengaliNumber(crop.quantity) : crop.quantity} {t('kg', 'কেজি')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Performance Chart', 'কর্মক্ষমতা চার্ট')}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className={`text-xs font-medium text-green-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {t('Saved', 'সংরক্ষিত')}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-red-50 px-2 py-1 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className={`text-xs font-medium text-red-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {t('Lost', 'হারিয়েছে')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-6 border border-gray-200">
              {/* Chart Container with fixed height */}
              <div className="h-64 relative mb-8">
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-evenly px-4 h-56">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center group" style={{ width: `${100 / chartData.length - 2}%`, maxWidth: '70px', minWidth: '40px' }}>
                      <div className="w-full flex flex-col mb-3 relative">
                        <div 
                          className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-md transition-all duration-300 hover:from-green-600 hover:to-green-500 cursor-pointer relative overflow-hidden"
                          style={{ height: `${Math.min(data.saved * 1.8, 180)}px`, minHeight: '30px' }}
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute top-1 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold drop-shadow">
                            {language === 'bn' ? toBengaliNumber(data.saved) : data.saved}%
                          </div>
                        </div>
                        <div 
                          className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-b-md transition-all duration-300 hover:from-red-600 hover:to-red-500 cursor-pointer relative overflow-hidden"
                          style={{ height: `${Math.min(data.lost * 6, 80)}px`, minHeight: '20px' }}
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute top-1 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold drop-shadow">
                            {language === 'bn' ? toBengaliNumber(data.lost) : data.lost}%
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs text-gray-700 font-semibold text-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? data.labelBn : data.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-6 bg-gradient-to-br from-lime-50 to-green-50 border-2 border-lime-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-lime-900 mb-3 text-lg ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Key Insights', 'মূল অন্তর্দৃষ্টি')}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2 bg-white/60 rounded-lg p-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <p className={`text-sm text-gray-800 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Your success rate improved by 8% this month', 'এই মাসে আপনার সফলতার হার ৮% উন্নত হয়েছে')}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2 bg-white/60 rounded-lg p-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <p className={`text-sm text-gray-800 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Rice storage shows best performance (98% success)', 'ধান সংরক্ষণ সেরা কর্মক্ষমতা দেখায় (৯৮% সফলতা)')}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2 bg-white/60 rounded-lg p-2">
                    <span className="text-yellow-600 font-bold">⚠</span>
                    <p className={`text-sm text-gray-800 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Consider upgrading wheat storage conditions', 'গম সংরক্ষণের অবস্থা উন্নত করার কথা বিবেচনা করুন')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics

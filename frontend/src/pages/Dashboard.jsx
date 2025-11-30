import { useState, useEffect } from 'react'
import CropRegistration from '../components/CropRegistration'
import Profile from '../components/Profile'
import Alerts from '../components/Alerts'
import Analytics from '../components/Analytics'
import CropDetails from '../components/CropDetails'
import Weather from '../components/Weather'
import RiskMap from '../components/RiskMap'
import SmartAlerts from '../components/SmartAlerts'
import AlertTester from '../components/AlertTester'

import BuyerDashboard from '../components/BuyerDashboard'
import RecentSales from '../components/RecentSales'
import VoiceAssistant from '../components/VoiceAssistant'
import { useLanguage } from '../context/LanguageContext'
import { useAuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { profileAPI, cropAPI, predictionAPI } from '../services/api'
import { useOfflineSync } from '../hooks/useOfflineSync'

const Dashboard = ({ onLogout }) => {
  const [showCropReg, setShowCropReg] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [showRiskMap, setShowRiskMap] = useState(false)
  const [showSmartAlerts, setShowSmartAlerts] = useState(false)
  const [showAlertTester, setShowAlertTester] = useState(false)
  const [showPestId, setShowPestId] = useState(false)
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [crops, setCrops] = useState([])
  const [cropCount, setCropCount] = useState(0)
  const [activeAlerts, setActiveAlerts] = useState(0)
  const [totalWeight, setTotalWeight] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('crops')
  const [showAllCrops, setShowAllCrops] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()
  const { user, logout } = useAuthContext()
  const { isSyncing, pendingCount, syncOfflineData } = useOfflineSync()

  // Translation maps for crop types and storage types
  const cropTypeTranslations = {
    'Rice': 'ধান',
    'Paddy': 'ধান',
    'Wheat': 'গম',
    'Corn': 'ভুট্টা',
    'Potato': 'আলু',
    'Vegetables': 'সবজি',
    'Fruits': 'ফল',
    'Maize': 'ভুট্টা'
  }

  const storageTypeTranslations = {
    'Warehouse': 'গুদাম',
    'Open Area': 'খোলা জায়গা',
    'Jute Bag Stack': 'পাটের বস্তার স্তূপ',
    'Cold Storage': 'হিমাগার',
    'Silo': 'সাইলো'
  }

  const translateCropType = (type) => {
    if (language === 'bn' && cropTypeTranslations[type]) {
      return cropTypeTranslations[type]
    }
    return type
  }

  const translateStorageType = (type) => {
    if (language === 'bn' && storageTypeTranslations[type]) {
      return storageTypeTranslations[type]
    }
    return type
  }

  // Show buyer dashboard if user is a buyer
  if (user?.userType === 'buyer') {
    return <BuyerDashboard />
  }

  // Note: Real-time alert streaming removed - use Smart Alerts button instead

  // Fetch user crops and count
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [cropsResponse, countResponse, predictionsResponse] = await Promise.all([
        cropAPI.getAllCrops(),
        cropAPI.getCropCount(),
        predictionAPI.getAllPredictions().catch(() => ({ data: { success: false } }))
      ])

      if (cropsResponse.data.success) {
        const cropsData = cropsResponse.data.crops || []
        setCrops(cropsData)

        // Calculate total weight from all crops
        const weight = cropsData.reduce((sum, crop) => {
          const w = parseFloat(crop.weight) || 0
          return sum + w
        }, 0)
        setTotalWeight(weight)
      }

      if (countResponse.data.success) {
        setCropCount(countResponse.data.count || 0)
      }

      if (predictionsResponse.data.success) {
        const predictions = predictionsResponse.data.predictions || []

        // Get reviewed alerts from localStorage
        const reviewedAlertsData = localStorage.getItem('reviewedAlerts')
        const reviewedAlerts = reviewedAlertsData ? new Set(JSON.parse(reviewedAlertsData)) : new Set()

        // Filter out reviewed alerts and count only high/medium/critical risk that aren't reviewed
        const highRiskCount = predictions.filter(p => {
          const isHighRisk = p.riskLevel === 'Critical' || p.riskLevel === 'High' || p.riskLevel === 'Medium'
          const isNotReviewed = !reviewedAlerts.has(p.crop.id)
          return isHighRisk && isNotReviewed
        }).length

        setActiveAlerts(highRiskCount)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Handler for successful crop registration
  const handleCropRegistered = () => {
    fetchDashboardData()
  }

  const handleLogout = () => {
    logout()
    if (onLogout) onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-lime-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4C10 4.5 10.2 5 10.59 5.41C11 5.81 11.5 6 12 6C12.5 6 13 5.81 13.41 5.41C13.81 5 14 4.5 14 4C14 3.5 13.81 3 13.41 2.59C13 2.19 12.5 2 12 2M12 7C10.9 7 10 7.9 10 9C10 9.79 10.5 10.47 11.21 10.82C9.89 11.46 9 12.86 9 14.5C9 15.14 9.12 15.75 9.34 16.31C8.5 15.5 8 14.3 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 14.3 15.5 15.5 14.66 16.31C14.88 15.75 15 15.14 15 14.5C15 12.86 14.11 11.46 12.79 10.82C13.5 10.47 14 9.79 14 9C14 7.9 13.1 7 12 7M12 11C10.62 11 9.5 12.12 9.5 13.5C9.5 14.88 10.62 16 12 16C13.38 16 14.5 14.88 14.5 13.5C14.5 12.12 13.38 11 12 11M7 14C5.9 14 5 14.9 5 16C5 17.1 5.9 18 7 18C8.1 18 9 17.1 9 16C9 14.9 8.1 14 7 14M17 14C15.9 14 15 14.9 15 16C15 17.1 15.9 18 17 18C18.1 18 19 17.1 19 16C19 14.9 18.1 14 17 14M7 19C5.34 19 4 20.34 4 22H10C10 20.34 8.66 19 7 19M17 19C15.34 19 14 20.34 14 22H20C20 20.34 18.66 19 17 19Z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">HarvestGuard</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              title={language === 'en' ? 'Switch to Bangla' : 'Switch to English'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="text-sm font-medium">{language === 'en' ? 'বাং' : 'EN'}</span>
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">{t('Profile', 'প্রোফাইল')}</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {t('Logout', 'লগআউট')}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-lime-500 to-green-600 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              t(`Welcome back, ${user?.fullname || 'Farmer'}! 👋`, `স্বাগতম, ${user?.fullname || 'কৃষক'}! 👋`)
            )}
          </h1>
          <p className="text-lime-50">
            {t('Manage your crops and monitor storage conditions', 'আপনার ফসল পরিচালনা করুন এবং সংরক্ষণের অবস্থা পর্যবেক্ষণ করুন')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{t('Total Crops', 'মোট ফসল')}</span>
              <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : cropCount}</p>
            <p className="text-xs text-green-600 mt-1">{t('Total registered', 'মোট নিবন্ধিত')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{t('Active Alerts', 'সক্রিয় সতর্কতা')}</span>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : activeAlerts}</p>
            <p className="text-xs text-orange-600 mt-1">{t('Needs attention', 'মনোযোগ প্রয়োজন')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{t('Total Weight', 'মোট ওজন')}</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : totalWeight.toFixed(1)}</p>
            <p className="text-xs text-blue-600 mt-1">{t('kg stored', 'কেজি সংরক্ষিত')}</p>
          </div>
        </div>

        {/* Offline Sync Status */}
        {pendingCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  {pendingCount} crop{pendingCount > 1 ? 's' : ''} pending sync
                </p>
                <p className="text-xs text-yellow-600">
                  {navigator.onLine ? 'Click sync to upload' : 'Will sync when you go online'}
                </p>
              </div>
            </div>
            {navigator.onLine && (
              <button
                onClick={async () => {
                  const result = await syncOfflineData()
                  if (result.success && result.count > 0) {
                    fetchDashboardData()
                  }
                }}
                disabled={isSyncing}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold"
              >
                {isSyncing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync Now
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Quick Actions', 'দ্রুত কাজ')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setShowCropReg(true)}
              className="flex items-center space-x-3 p-4 border-2 border-lime-200 hover:border-lime-400 hover:bg-lime-50 rounded-lg transition group"
            >
              <div className="w-12 h-12 bg-lime-100 group-hover:bg-lime-200 rounded-lg flex items-center justify-center transition">
                <svg className="w-6 h-6 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{t('Register New Crop', 'নতুন ফসল নিবন্ধন')}</p>
                <p className="text-xs text-gray-600">{t('Add crop to inventory', 'তালিকায় ফসল যোগ করুন')}</p>
              </div>
            </button>

            <button
              onClick={() => setShowAnalytics(true)}
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition group"
            >
              <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{t('View Analytics', 'বিশ্লেষণ দেখুন')}</p>
                <p className="text-xs text-gray-600">{t('Check performance', 'কর্মক্ষমতা পরীক্ষা করুন')}</p>
              </div>
            </button>

            <button
              onClick={() => setShowAlerts(true)}
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 rounded-lg transition group"
            >
              <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{t('View Alerts', 'সতর্কতা দেখুন')}</p>
                <p className="text-xs text-gray-600">
                  {activeAlerts > 0
                    ? t(`${activeAlerts} pending alerts`, `${activeAlerts}টি মুলতুবি সতর্কতা`)
                    : t('No active alerts', 'কোন সক্রিয় সতর্কতা নেই')
                  }
                </p>
              </div>
            </button>

            <button
              onClick={() => setShowWeather(true)}
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 hover:border-cyan-400 hover:bg-cyan-50 rounded-lg transition group"
            >
              <div className="w-12 h-12 bg-cyan-100 group-hover:bg-cyan-200 rounded-lg flex items-center justify-center transition">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{t('Weather Forecast', 'আবহাওয়া পূর্বাভাস')}</p>
                <p className="text-xs text-gray-600">{t('5-day local weather', '৫ দিনের স্থানীয় আবহাওয়া')}</p>
              </div>
            </button>

            <button
              onClick={() => setShowRiskMap(true)}
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 rounded-lg transition group"
            >
              <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{t('Risk Map', 'ঝুঁকি মানচিত্র')}</p>
                <p className="text-xs text-gray-600">{t('Local farm risks', 'স্থানীয় খামার ঝুঁকি')}</p>
              </div>
            </button>

            <button
              onClick={() => setShowSmartAlerts(true)}
              className="flex items-center space-x-3 p-4 border-2 border-red-200 hover:border-red-400 hover:bg-red-50 rounded-lg transition group"
            >
              <div className="w-12 h-12 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{t('Smart Alerts', 'স্মার্ট সতর্কতা')}</p>
                <p className="text-xs text-gray-600">{t('AI Advice', 'এআই পরামর্শ')}</p>
              </div>
            </button>

            <button
              onClick={() => setShowAlertTester(true)}
              className="flex items-center space-x-3 p-4 border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 rounded-lg transition group"
            >
              <div className="w-12 h-12 bg-pink-100 group-hover:bg-pink-200 rounded-lg flex items-center justify-center transition">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{t('Test Alerts', 'টেস্ট সতর্কতা')}</p>
                <p className="text-xs text-gray-600">{t('Custom Test', 'কাস্টম টেস্ট')}</p>
              </div>
            </button>

            <button
              onClick={() => setShowPestId(true)}
              className="flex items-center space-x-3 p-4 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-lg transition group"
            >
              <div className="w-12 h-12 bg-emerald-100 group-hover:bg-emerald-200 rounded-lg flex items-center justify-center transition">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{t('Pest ID', 'কীটপতঙ্গ শনাক্ত')}</p>
                <p className="text-xs text-gray-600">{t('AI Vision', 'এআই ভিশন')}</p>
              </div>
            </button>

            <button
              onClick={() => setShowVoiceAssistant(true)}
              className="flex items-center space-x-3 p-4 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-lg transition group"
            >
              <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{t('Voice Assistant', 'ভয়েস সহায়ক')}</p>
                <p className="text-xs text-gray-600">{t('Ask in Bangla', 'বাংলায় জিজ্ঞাসা করুন')}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Tabbed Section: Recent Crops & Sales */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('crops')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition ${activeTab === 'crops'
                    ? 'text-lime-600 border-b-2 border-lime-600 bg-lime-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } ${language === 'bn' ? 'font-bengali' : ''}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4C10 4.5 10.2 5 10.59 5.41C11 5.81 11.5 6 12 6C12.5 6 13 5.81 13.41 5.41C13.81 5 14 4.5 14 4C14 3.5 13.81 3 13.41 2.59C13 2.19 12.5 2 12 2M12 7C10.9 7 10 7.9 10 9C10 9.79 10.5 10.47 11.21 10.82C9.89 11.46 9 12.86 9 14.5C9 15.14 9.12 15.75 9.34 16.31C8.5 15.5 8 14.3 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 14.3 15.5 15.5 14.66 16.31C14.88 15.75 15 15.14 15 14.5C15 12.86 14.11 11.46 12.79 10.82C13.5 10.47 14 9.79 14 9C14 7.9 13.1 7 12 7M12 11C10.62 11 9.5 12.12 9.5 13.5C9.5 14.88 10.62 16 12 16C13.38 16 14.5 14.88 14.5 13.5C14.5 12.12 13.38 11 12 11M7 14C5.9 14 5 14.9 5 16C5 17.1 5.9 18 7 18C8.1 18 9 17.1 9 16C9 14.9 8.1 14 7 14M17 14C15.9 14 15 14.9 15 16C15 17.1 15.9 18 17 18C18.1 18 19 17.1 19 16C19 14.9 18.1 14 17 14M7 19C5.34 19 4 20.34 4 22H10C10 20.34 8.66 19 7 19M17 19C15.34 19 14 20.34 14 22H20C20 20.34 18.66 19 17 19Z" />
                  </svg>
                  <span>{t('Recent Crops', 'সাম্প্রতিক ফসল')}</span>
                  {crops.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-lime-100 text-lime-700 text-xs rounded-full font-bold">
                      {crops.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition ${activeTab === 'sales'
                    ? 'text-lime-600 border-b-2 border-lime-600 bg-lime-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } ${language === 'bn' ? 'font-bengali' : ''}`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{t('Recent Sales', 'সাম্প্রতিক বিক্রয়')}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'crops' && (
              <div>
                <h2 className={`text-xl font-bold text-gray-900 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Recent Crops', 'সাম্প্রতিক ফসল')}
                </h2>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : crops.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="font-medium">{t('No crops registered yet', 'এখনও কোন ফসল নিবন্ধিত নেই')}</p>
                    <p className="text-sm mt-1">{t('Click "Register New Crop" to get started', 'শুরু করতে "নতুন ফসল নিবন্ধন" ক্লিক করুন')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(showAllCrops ? crops : crops.slice(0, 3)).map((crop) => {
                      const harvestDate = crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'

                      return (
                        <button
                          key={crop._id}
                          onClick={() => setSelectedCrop(crop)}
                          className="w-full p-4 bg-gradient-to-r from-gray-50 to-lime-50 rounded-xl hover:from-gray-100 hover:to-lime-100 transition-all border border-gray-200 hover:border-lime-300 hover:shadow-md"
                        >
                          <div className="flex items-start space-x-4">
                            {/* Icon */}
                            <div className="w-14 h-14 bg-lime-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                              <svg className="w-7 h-7 text-lime-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4C10 4.5 10.2 5 10.59 5.41C11 5.81 11.5 6 12 6C12.5 6 13 5.81 13.41 5.41C13.81 5 14 4.5 14 4C14 3.5 13.81 3 13.41 2.59C13 2.19 12.5 2 12 2M12 7C10.9 7 10 7.9 10 9C10 9.79 10.5 10.47 11.21 10.82C9.89 11.46 9 12.86 9 14.5C9 15.14 9.12 15.75 9.34 16.31C8.5 15.5 8 14.3 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 14.3 15.5 15.5 14.66 16.31C14.88 15.75 15 15.14 15 14.5C15 12.86 14.11 11.46 12.79 10.82C13.5 10.47 14 9.79 14 9C14 7.9 13.1 7 12 7M12 11C10.62 11 9.5 12.12 9.5 13.5C9.5 14.88 10.62 16 12 16C13.38 16 14.5 14.88 14.5 13.5C14.5 12.12 13.38 11 12 11M7 14C5.9 14 5 14.9 5 16C5 17.1 5.9 18 7 18C8.1 18 9 17.1 9 16C9 14.9 8.1 14 7 14M17 14C15.9 14 15 14.9 15 16C15 17.1 15.9 18 17 18C18.1 18 19 17.1 19 16C19 14.9 18.1 14 17 14M7 19C5.34 19 4 20.34 4 22H10C10 20.34 8.66 19 7 19M17 19C15.34 19 14 20.34 14 22H20C20 20.34 18.66 19 17 19Z" />
                              </svg>
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-left">
                              {/* Crop Name */}
                              <h3 className={`text-lg font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                                {translateCropType(crop.cropType)}
                              </h3>

                              {/* Details Grid */}
                              <div className="grid grid-cols-3 gap-3">
                                {/* Quantity */}
                                <div className="flex items-center space-x-1.5">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                  </svg>
                                  <div>
                                    <p className={`text-xs text-gray-500 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('Quantity', 'পরিমাণ')}</p>
                                    <p className="text-sm font-semibold text-gray-900">{crop.weight} {language === 'bn' ? 'কেজি' : 'kg'}</p>
                                  </div>
                                </div>

                                {/* Storage Type */}
                                <div className="flex items-center space-x-1.5">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                  <div>
                                    <p className={`text-xs text-gray-500 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('Storage', 'সংরক্ষণ')}</p>
                                    <p className={`text-sm font-semibold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>{translateStorageType(crop.storageType)}</p>
                                  </div>
                                </div>

                                {/* Harvest Date */}
                                <div className="flex items-center space-x-1.5">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <div>
                                    <p className={`text-xs text-gray-500 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('Harvest', 'ফসল কাটা')}</p>
                                    <p className="text-sm font-semibold text-gray-900">{harvestDate}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="flex-shrink-0">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* View All/Show Less Button */}
                {crops.length > 3 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowAllCrops(!showAllCrops)}
                      className={`inline-flex items-center space-x-2 text-lime-600 hover:text-lime-700 font-semibold text-sm transition ${language === 'bn' ? 'font-bengali' : ''}`}
                    >
                      <span>
                        {showAllCrops
                          ? t('Show Less', 'কম দেখুন')
                          : `${t('View All', 'সব দেখুন')} (${crops.length})`}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${showAllCrops ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sales' && (
              <RecentSales />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCropReg && <CropRegistration onClose={() => setShowCropReg(false)} onSuccess={handleCropRegistered} />}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      {showAlerts && <Alerts onClose={() => { setShowAlerts(false); fetchDashboardData(); }} onCropSelect={(crop) => { setSelectedCrop(crop); setShowAlerts(false); }} />}
      {showAnalytics && <Analytics onClose={() => setShowAnalytics(false)} />}
      {showWeather && <Weather onClose={() => setShowWeather(false)} />}
      {showRiskMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('Local Risk Map', 'স্থানীয় ঝুঁকি মানচিত্র')}</h2>
              <button
                onClick={() => setShowRiskMap(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <RiskMap />
            </div>
          </div>
        </div>
      )}
      {showSmartAlerts && <SmartAlerts onClose={() => setShowSmartAlerts(false)} />}
      {showAlertTester && <AlertTester onClose={() => setShowAlertTester(false)} />}
      {showPestId && <PestIdentification onClose={() => setShowPestId(false)} />}
      {showVoiceAssistant && <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />}
      {selectedCrop && <CropDetails crop={selectedCrop} onClose={() => setSelectedCrop(null)} />}
    </div>
  )
}

export default Dashboard

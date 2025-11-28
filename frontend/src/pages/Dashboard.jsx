import { useState } from 'react'
import CropRegistration from '../components/CropRegistration'
import Profile from '../components/Profile'
import Alerts from '../components/Alerts'
import Analytics from '../components/Analytics'
import CropDetails from '../components/CropDetails'
import Weather from '../components/Weather'
import { useLanguage } from '../context/LanguageContext'

const Dashboard = ({ onLogout }) => {
  const [showCropReg, setShowCropReg] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState(null)
  const { language, toggleLanguage, t } = useLanguage()

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
              onClick={onLogout}
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
            {t('Welcome back, Rahim Ali! 👋', 'স্বাগতম, রহিম আলী! 👋')}
          </h1>
          <p className="text-lime-50">
            {t('Manage your crops and monitor storage conditions', 'আপনার ফসল পরিচালনা করুন এবং সংরক্ষণের অবস্থা পর্যবেক্ষণ করুন')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{t('Total Crops', 'মোট ফসল')}</span>
              <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-xs text-green-600 mt-1">{t('+2 this month', '+২ এই মাসে')}</p>
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
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-xs text-orange-600 mt-1">{t('Needs attention', 'মনোযোগ প্রয়োজন')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{t('Storage Used', 'ব্যবহৃত সংরক্ষণ')}</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">68%</p>
            <p className="text-xs text-blue-600 mt-1">{t('2.4 tons capacity', '২.৪ টন ধারণক্ষমতা')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{t('Success Rate', 'সফলতার হার')}</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">95%</p>
            <p className="text-xs text-green-600 mt-1">{t('Above average', 'গড়ের উপরে')}</p>
          </div>
        </div>

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
                <p className="text-xs text-gray-600">{t('3 pending alerts', '৩টি মুলতুবি সতর্কতা')}</p>
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
          </div>
        </div>

        {/* Recent Crops */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Recent Crops', 'সাম্প্রতিক ফসল')}</h2>
          <div className="space-y-3">
            {[
              { name: 'Rice BR-28', quantity: '500 kg', status: 'Good', color: 'green' },
              { name: 'Wheat', quantity: '300 kg', status: 'Warning', color: 'orange' },
              { name: 'Potato', quantity: '200 kg', status: 'Good', color: 'green' },
            ].map((crop, index) => (
              <button
                key={index}
                onClick={() => setSelectedCrop(crop)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-lime-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{crop.name}</p>
                    <p className="text-sm text-gray-600">{crop.quantity}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  crop.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {crop.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCropReg && <CropRegistration onClose={() => setShowCropReg(false)} />}
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      {showAlerts && <Alerts onClose={() => setShowAlerts(false)} />}
      {showAnalytics && <Analytics onClose={() => setShowAnalytics(false)} />}
      {showWeather && <Weather onClose={() => setShowWeather(false)} />}
      {selectedCrop && <CropDetails crop={selectedCrop} onClose={() => setSelectedCrop(null)} />}
    </div>
  )
}

export default Dashboard

import { useState, useEffect } from 'react'
import { buyerAPI, districtsAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useAuthContext } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import FarmerCard from './FarmerCard'
import FarmerDetailsModal from './FarmerDetailsModal'
import BuyerProfile from './BuyerProfile'

const BuyerDashboard = () => {
  const [farmers, setFarmers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    upazilla: '',
    cropType: ''
  })
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [upazillaSuggestions, setUpazillaSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const cropTypes = ['Paddy', 'Rice', 'Wheat', 'Corn', 'Potato', 'Vegetables', 'Fruits']
  
  const { showError, showSuccess } = useToast()
  const { user, logout } = useAuthContext()
  const { language, toggleLanguage, t } = useLanguage()

  const handleLogout = async () => {
    try {
      await logout()
      showSuccess('Logged out successfully')
    } catch (error) {
      showError('Failed to logout')
    }
  }

  useEffect(() => {
    searchFarmers()
  }, [])

  const searchFarmers = async () => {
    setIsLoading(true)
    try {
      // Only send non-empty parameters
      const params = {}
      if (searchParams.upazilla) params.upazilla = searchParams.upazilla
      if (searchParams.cropType) params.cropType = searchParams.cropType
      
      const response = await buyerAPI.searchFarmers(params)
      if (response.data.success) {
        setFarmers(response.data.farmers)
      }
    } catch (error) {
      showError('Failed to load farmers')
      console.error('Error loading farmers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpazillaSearch = async (query) => {
    if (query.length < 2) {
      setUpazillaSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const response = await districtsAPI.searchDistricts(query)
      if (response.data.success) {
        setUpazillaSuggestions(response.data.districts)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Error searching upazilla:', error)
    }
  }

  const handleSelectUpazilla = (district) => {
    setSearchParams({ upazilla: district.nameEn })
    setShowSuggestions(false)
  }

  const handleViewDetails = async (farmerId) => {
    try {
      const response = await buyerAPI.getFarmerDetails(farmerId)
      if (response.data.success) {
        setSelectedFarmer(response.data.farmer)
        setShowDetailsModal(true)
      }
    } catch (error) {
      showError('Failed to load farmer details')
      console.error('Error loading farmer details:', error)
    }
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
            {t(`Welcome back, ${user?.fullname || 'Buyer'}! 👋`, `স্বাগতম, ${user?.fullname || 'ক্রেতা'}! 👋`)}
          </h1>
          <p className="text-lime-50">
            {t('Manage your crops and monitor storage conditions', 'আপনার ফসল পরিচালনা করুন এবং সংরক্ষণের অবস্থা পর্যবেক্ষণ করুন')}
          </p>
        </div>
        
        {/* Search Section */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('Find Farmers', 'কৃষক খুঁজুন')}</h2>
        
        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Upazilla / District', 'উপজেলা / জেলা')}
              </label>
              <input
                type="text"
                value={searchParams.upazilla}
                onChange={(e) => {
                  setSearchParams({ ...searchParams, upazilla: e.target.value })
                  handleUpazillaSearch(e.target.value)
                }}
                placeholder={t('Search upazilla or district...', 'উপজেলা বা জেলা খুঁজুন...')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                autoComplete="off"
              />
              {showSuggestions && upazillaSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {upazillaSuggestions.map((district, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectUpazilla(district)}
                      className="px-4 py-2 hover:bg-lime-50 cursor-pointer"
                    >
                      <div className="font-medium">{district.nameEn}</div>
                      <div className="text-sm text-gray-500">{district.nameBn}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Crop Type (Optional)', 'ফসলের ধরন (ঐচ্ছিক)')}
              </label>
              <select
                value={searchParams.cropType}
                onChange={(e) => setSearchParams({ ...searchParams, cropType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              >
                <option value="">{t('All Crops', 'সব ফসল')}</option>
                {cropTypes.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={searchFarmers}
                disabled={isLoading}
                className="w-full px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? t('Searching...', 'খুঁজছি...') : t('Search', 'খুঁজুন')}
              </button>
            </div>
          </div>
        </div>

        {/* Farmers List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : farmers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">{t('No farmers found. Try adjusting your search.', 'কোন কৃষক পাওয়া যায়নি। আপনার অনুসন্ধান সামঞ্জস্য করুন।')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmers.map((farmer) => (
              <FarmerCard
                key={farmer._id}
                farmer={farmer}
                onViewDetails={() => handleViewDetails(farmer._id)}
              />
            ))}
          </div>
        )}
      </main>

      {showDetailsModal && selectedFarmer && (
        <FarmerDetailsModal
          farmer={selectedFarmer}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedFarmer(null)
          }}
        />
      )}

      {showProfile && (
        <BuyerProfile
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  )
}

export default BuyerDashboard

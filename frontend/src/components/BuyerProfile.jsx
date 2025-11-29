import { useState, useEffect } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { buyerAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

const BuyerProfile = ({ onClose }) => {
  const { user: contextUser } = useAuthContext()
  const [user, setUser] = useState(contextUser)
  const [isLoading, setIsLoading] = useState(true)
  const { showError } = useToast()
  const { language, t } = useLanguage()

  useEffect(() => {
    fetchBuyerProfile()
  }, [])

  const fetchBuyerProfile = async () => {
    try {
      setIsLoading(true)
      const response = await buyerAPI.getBuyerProfile()
      if (response.data.success) {
        setUser(response.data.buyer)
      }
    } catch (error) {
      console.error('Error fetching buyer profile:', error)
      showError('Failed to load profile')
      setUser(contextUser)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full relative animate-fade-in-up my-4 sm:my-8 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center transition-all hover:scale-110 z-50"
          aria-label="Close"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Profile Header */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user?.fullname?.charAt(0) || 'B'}
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{user?.fullname || 'Buyer'}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-2">{user?.email}</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {t('Buyer Account', 'ক্রেতা অ্যাকাউন্ট')}
                </span>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('Personal Information', 'ব্যক্তিগত তথ্য')}
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t('Full Name', 'নাম')} / {language === 'en' ? 'নাম' : 'Full Name'}
                        </label>
                        <p className="text-sm text-gray-900 font-medium">{user?.fullname || t('Not provided', 'প্রদান করা হয়নি')}</p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t('Email', 'ইমেইল')} / {language === 'en' ? 'ইমেইল' : 'Email'}
                        </label>
                        <p className="text-sm text-gray-900 font-medium">{user?.email || t('Not provided', 'প্রদান করা হয়নি')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t('Phone', 'ফোন')} / {language === 'en' ? 'ফোন' : 'Phone'}
                        </label>
                        <p className="text-sm text-gray-900 font-medium">{user?.mobile || t('Not provided', 'প্রদান করা হয়নি')}</p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t('Upazila', 'উপজেলা')} / {language === 'en' ? 'উপজেলা' : 'Upazila'}
                        </label>
                        <p className="text-sm text-gray-900 font-medium">
                          {user?.upazilla || user?.district || t('Not provided', 'প্রদান করা হয়নি')}
                        </p>
                      </div>
                    </div>
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

export default BuyerProfile

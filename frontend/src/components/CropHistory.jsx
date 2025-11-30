import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { cropAPI } from '../services/api'

const CropHistory = ({ crop, onClose }) => {
  const { language, t } = useLanguage()
  const { showError } = useToast()
  const [history, setHistory] = useState([])
  const [cropInfo, setCropInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Convert English numbers to Bangla
  const toBanglaNumber = (num) => {
    if (!num) return num
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return String(num).replace(/\d/g, (digit) => banglaDigits[digit])
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    const formatted = date.toLocaleDateString('en-US', options)
    
    if (language === 'bn') {
      return toBanglaNumber(formatted)
    }
    return formatted
  }

  useEffect(() => {
    fetchHistory()
  }, [crop._id])

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      const response = await cropAPI.getCropHistory(crop._id)
      
      if (response.data.success) {
        setHistory(response.data.history || [])
        setCropInfo(response.data.crop)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('Failed to load history', 'ইতিহাস লোড করতে ব্যর্থ')
      showError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative animate-fade-in-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className={`text-2xl font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {t('Sales History', 'বিক্রয় ইতিহাস')}
          </h2>
          <p className={`text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {crop.cropType}
          </p>
        </div>

        {/* Crop Summary */}
        {cropInfo && (
          <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Initial Stock', 'প্রাথমিক স্টক')}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {language === 'bn' ? toBanglaNumber(cropInfo.initialWeight) : cropInfo.initialWeight} {language === 'bn' ? 'কেজি' : 'kg'}
                </p>
              </div>
              <div>
                <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Current Stock', 'বর্তমান স্টক')}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {language === 'bn' ? toBanglaNumber(cropInfo.currentWeight) : cropInfo.currentWeight} {language === 'bn' ? 'কেজি' : 'kg'}
                </p>
              </div>
              <div>
                <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Status', 'স্ট্যাটাস')}
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  cropInfo.status === 'sold' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                } ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {cropInfo.status === 'sold' 
                    ? t('Sold', 'বিক্রিত') 
                    : t('Active', 'সক্রিয়')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* History List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className={`text-gray-500 font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('No sales history yet', 'এখনও কোন বিক্রয় ইতিহাস নেই')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry, index) => (
              <div 
                key={entry._id || index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-lime-300 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      entry.updateType === 'complete' 
                        ? 'bg-green-100' 
                        : 'bg-blue-100'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        entry.updateType === 'complete' 
                          ? 'text-green-600' 
                          : 'text-blue-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {entry.updateType === 'complete' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className={`font-semibold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {entry.updateType === 'complete' 
                          ? t('Complete Sale', 'সম্পূর্ণ বিক্রয়') 
                          : t('Partial Sale', 'আংশিক বিক্রয়')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold text-gray-900`}>
                      {language === 'bn' ? toBanglaNumber(entry.soldAmount) : entry.soldAmount} {language === 'bn' ? 'কেজি' : 'kg'}
                    </p>
                    <p className={`text-xs text-gray-500 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Sold', 'বিক্রিত')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {entry.buyerName && (
                    <div>
                      <p className={`text-gray-600 text-xs ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {t('Buyer', 'ক্রেতা')}
                      </p>
                      <p className="font-medium text-gray-900">{entry.buyerName}</p>
                    </div>
                  )}
                  <div>
                    <p className={`text-gray-600 text-xs ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Remaining', 'অবশিষ্ট')}
                    </p>
                    <p className="font-medium text-gray-900">
                      {language === 'bn' ? toBanglaNumber(entry.remainingAmount) : entry.remainingAmount} {language === 'bn' ? 'কেজি' : 'kg'}
                    </p>
                  </div>
                </div>

                {entry.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className={`text-xs text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Notes', 'নোট')}:
                    </p>
                    <p className="text-sm text-gray-700">{entry.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className={`w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition ${language === 'bn' ? 'font-bengali' : ''}`}
          >
            {t('Close', 'বন্ধ করুন')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CropHistory

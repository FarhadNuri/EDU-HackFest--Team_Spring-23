import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { cropAPI } from '../services/api'

const RecentSales = () => {
  const { language, t } = useLanguage()
  const { showError } = useToast()
  const [sales, setSales] = useState([])
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAllSales, setShowAllSales] = useState(false)

  // Translation maps
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

  // Convert English numbers to Bangla
  const toBanglaNumber = (num) => {
    if (!num) return num
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return String(num).replace(/\d/g, (digit) => banglaDigits[digit])
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { month: 'short', day: 'numeric', year: 'numeric' }
    const formatted = date.toLocaleDateString('en-US', options)
    
    if (language === 'bn') {
      return toBanglaNumber(formatted)
    }
    return formatted
  }

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      setIsLoading(true)
      const response = await cropAPI.getAllSales()
      
      if (response.data.success) {
        setSales(response.data.sales || [])
        setSummary(response.data.summary)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('Failed to load sales', 'বিক্রয় লোড করতে ব্যর্থ')
      showError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
          {t('Recent Sales', 'সাম্প্রতিক বিক্রয়')}
        </h2>
        {summary && (
          <div className="text-right">
            <p className={`text-sm text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Total Sold', 'মোট বিক্রিত')}
            </p>
            <p className="text-lg font-bold text-lime-600">
              {language === 'bn' ? toBanglaNumber(summary.totalSold.toFixed(1)) : summary.totalSold.toFixed(1)} {language === 'bn' ? 'কেজি' : 'kg'}
            </p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : sales.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className={`font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>
            {t('No sales recorded yet', 'এখনও কোন বিক্রয় রেকর্ড নেই')}
          </p>
          <p className={`text-sm mt-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {t('Sales will appear here after you update crop status', 'ফসলের স্ট্যাটাস আপডেট করার পর বিক্রয় এখানে দেখা যাবে')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(showAllSales ? sales : sales.slice(0, 3)).map((sale) => (
            <div
              key={sale._id}
              className="p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200 hover:border-lime-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  sale.updateType === 'complete' 
                    ? 'bg-green-100' 
                    : 'bg-blue-100'
                }`}>
                  <svg className={`w-7 h-7 ${
                    sale.updateType === 'complete' 
                      ? 'text-green-600' 
                      : 'text-blue-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {sale.updateType === 'complete' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    )}
                  </svg>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  {/* Crop Name and Type Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {sale.cropId ? translateCropType(sale.cropId.cropType) : t('Unknown Crop', 'অজানা ফসল')}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sale.updateType === 'complete' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    } ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {sale.updateType === 'complete' 
                        ? t('Complete', 'সম্পূর্ণ') 
                        : t('Partial', 'আংশিক')}
                    </span>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {/* Sold Amount */}
                    <div className="flex items-start space-x-1">
                      <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      <div>
                        <p className={`text-xs text-gray-500 ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {t('Sold', 'বিক্রিত')}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {language === 'bn' ? toBanglaNumber(sale.soldAmount) : sale.soldAmount} {language === 'bn' ? 'কেজি' : 'kg'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Date */}
                    <div className="flex items-start space-x-1">
                      <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className={`text-xs text-gray-500 ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {t('Date', 'তারিখ')}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">{formatDate(sale.timestamp)}</p>
                      </div>
                    </div>
                    
                    {/* Buyer */}
                    {sale.buyerName && (
                      <div className="flex items-start space-x-1">
                        <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className={`text-xs text-gray-500 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Buyer', 'ক্রেতা')}
                          </p>
                          <p className="text-sm font-semibold text-gray-900">{sale.buyerName}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Remaining */}
                    <div className="flex items-start space-x-1">
                      <svg className="w-3.5 h-3.5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <div>
                        <p className={`text-xs text-gray-500 ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {t('Remaining', 'অবশিষ্ট')}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {language === 'bn' ? toBanglaNumber(sale.remainingAmount) : sale.remainingAmount} {language === 'bn' ? 'কেজি' : 'kg'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {sale.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 italic">{sale.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* View All/Show Less Button */}
      {sales.length > 3 && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => setShowAllSales(!showAllSales)}
            className={`inline-flex items-center space-x-2 text-lime-600 hover:text-lime-700 font-semibold text-sm transition ${language === 'bn' ? 'font-bengali' : ''}`}
          >
            <span>
              {showAllSales 
                ? t('Show Less', 'কম দেখুন') 
                : `${t('View All', 'সব দেখুন')} (${sales.length})`}
            </span>
            <svg 
              className={`w-4 h-4 transition-transform ${showAllSales ? 'rotate-180' : ''}`} 
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
  )
}

export default RecentSales

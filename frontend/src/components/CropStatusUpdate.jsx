import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { cropAPI } from '../services/api'

const CropStatusUpdate = ({ crop, onClose, onSuccess }) => {
  const { language, t } = useLanguage()
  const { showSuccess, showError } = useToast()
  
  const [updateType, setUpdateType] = useState('partial') // 'partial' or 'complete'
  const [soldAmount, setSoldAmount] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const remainingWeight = parseFloat(crop.weight) || 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updateData = {
        updateType,
        soldAmount: updateType === 'partial' ? parseFloat(soldAmount) : remainingWeight,
        buyerName: buyerName || undefined,
        notes: notes || undefined,
        timestamp: new Date().toISOString()
      }

      // Validate sold amount
      if (updateType === 'partial') {
        if (!soldAmount || parseFloat(soldAmount) <= 0) {
          showError(t('Please enter a valid amount', 'দয়া করে একটি বৈধ পরিমাণ লিখুন'))
          setIsLoading(false)
          return
        }
        if (parseFloat(soldAmount) > remainingWeight) {
          showError(t('Sold amount cannot exceed remaining quantity', 'বিক্রিত পরিমাণ অবশিষ্ট পরিমাণের বেশি হতে পারে না'))
          setIsLoading(false)
          return
        }
      }

      const response = await cropAPI.updateCropStatus(crop._id, updateData)

      if (response.data.success) {
        showSuccess(
          updateType === 'complete' 
            ? t('Crop marked as completely sold', 'ফসল সম্পূর্ণ বিক্রিত হিসাবে চিহ্নিত')
            : t('Crop status updated successfully', 'ফসলের স্ট্যাটাস সফলভাবে আপডেট হয়েছে')
        )
        if (onSuccess) onSuccess()
        onClose()
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('Failed to update status', 'স্ট্যাটাস আপডেট করতে ব্যর্থ')
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
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in-up max-h-[90vh] overflow-y-auto"
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
            {t('Update Crop Status', 'ফসলের স্ট্যাটাস আপডেট করুন')}
          </h2>
          <p className={`text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {crop.cropType} - {t('Remaining', 'অবশিষ্ট')}: {remainingWeight} {language === 'bn' ? 'কেজি' : 'kg'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Update Type */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Update Type', 'আপডেটের ধরন')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUpdateType('partial')}
                className={`p-4 rounded-lg border-2 transition ${
                  updateType === 'partial'
                    ? 'border-lime-600 bg-lime-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${language === 'bn' ? 'font-bengali' : ''}`}
              >
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-semibold">{t('Partial Sale', 'আংশিক বিক্রয়')}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUpdateType('complete')}
                className={`p-4 rounded-lg border-2 transition ${
                  updateType === 'complete'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${language === 'bn' ? 'font-bengali' : ''}`}
              >
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-semibold">{t('Complete Sale', 'সম্পূর্ণ বিক্রয়')}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Sold Amount (only for partial) */}
          {updateType === 'partial' && (
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Sold Amount', 'বিক্রিত পরিমাণ')} ({language === 'bn' ? 'কেজি' : 'kg'})
              </label>
              <input
                type="number"
                value={soldAmount}
                onChange={(e) => setSoldAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
                placeholder={t('Enter amount sold', 'বিক্রিত পরিমাণ লিখুন')}
                step="0.01"
                min="0"
                max={remainingWeight}
                required
              />
            </div>
          )}

          {/* Buyer Name (optional) */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Buyer Name', 'ক্রেতার নাম')} ({t('Optional', 'ঐচ্ছিক')})
            </label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
              placeholder={t('Enter buyer name', 'ক্রেতার নাম লিখুন')}
            />
          </div>

          {/* Notes (optional) */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Notes', 'নোট')} ({t('Optional', 'ঐচ্ছিক')})
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
              placeholder={t('Add any notes', 'কোন নোট যোগ করুন')}
              rows="3"
            />
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className={`font-semibold text-gray-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Summary', 'সারাংশ')}
            </h3>
            <div className="space-y-1 text-sm">
              <p className={language === 'bn' ? 'font-bengali' : ''}>
                {t('Current Stock', 'বর্তমান স্টক')}: <span className="font-semibold">{remainingWeight} {language === 'bn' ? 'কেজি' : 'kg'}</span>
              </p>
              <p className={language === 'bn' ? 'font-bengali' : ''}>
                {t('Selling', 'বিক্রয়')}: <span className="font-semibold">
                  {updateType === 'complete' ? remainingWeight : (soldAmount || 0)} {language === 'bn' ? 'কেজি' : 'kg'}
                </span>
              </p>
              <p className={language === 'bn' ? 'font-bengali' : ''}>
                {t('Remaining After Sale', 'বিক্রয়ের পর অবশিষ্ট')}: <span className="font-semibold">
                  {updateType === 'complete' ? 0 : (remainingWeight - (parseFloat(soldAmount) || 0))} {language === 'bn' ? 'কেজি' : 'kg'}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition ${language === 'bn' ? 'font-bengali' : ''}`}
            >
              {t('Cancel', 'বাতিল')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-6 py-3 bg-lime-600 text-white rounded-lg font-semibold hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${language === 'bn' ? 'font-bengali' : ''}`}
            >
              {isLoading ? t('Updating...', 'আপডেট হচ্ছে...') : t('Update Status', 'স্ট্যাটাস আপডেট করুন')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CropStatusUpdate

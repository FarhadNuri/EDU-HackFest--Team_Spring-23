import { useState } from 'react'
import { cropAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

const CropRegistration = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cropType: 'Rice',
    variety: '',
    weight: '',
    harvestDate: '',
    storageLocation: '',
    storageType: 'Warehouse',
    expectedStorageDuration: ''
  })
  const [loading, setLoading] = useState(false)
  const { showSuccess, showError } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare data for backend
      const cropData = {
        cropType: formData.cropType,
        variety: formData.variety || undefined,
        weight: formData.weight,
        harvestDate: formData.harvestDate,
        storageLocation: formData.storageLocation,
        storageType: formData.storageType,
        expectedStorageDuration: parseInt(formData.expectedStorageDuration)
      }

      // Check if offline
      if (!navigator.onLine) {
        // Save to localStorage
        const pending = JSON.parse(localStorage.getItem('pendingCrops') || '[]')
        pending.push({
          ...cropData,
          localId: `offline-${Date.now()}`,
          queuedAt: new Date().toISOString()
        })
        localStorage.setItem('pendingCrops', JSON.stringify(pending))
        
        showSuccess('Saved offline! Will sync when online.')
        if (onSuccess) onSuccess()
        onClose()
        return
      }

      // If online, normal API call
      const response = await cropAPI.registerCrop(cropData)
      
      if (response.data.success) {
        showSuccess('Crop registered successfully!')
        if (onSuccess) onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Crop registration error:', error)
      showError(error.response?.data?.message || 'Failed to register crop')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
            <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-lime-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4C10 4.5 10.2 5 10.59 5.41C11 5.81 11.5 6 12 6C12.5 6 13 5.81 13.41 5.41C13.81 5 14 4.5 14 4C14 3.5 13.81 3 13.41 2.59C13 2.19 12.5 2 12 2M12 7C10.9 7 10 7.9 10 9C10 9.79 10.5 10.47 11.21 10.82C9.89 11.46 9 12.86 9 14.5C9 15.14 9.12 15.75 9.34 16.31C8.5 15.5 8 14.3 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 14.3 15.5 15.5 14.66 16.31C14.88 15.75 15 15.14 15 14.5C15 12.86 14.11 11.46 12.79 10.82C13.5 10.47 14 9.79 14 9C14 7.9 13.1 7 12 7M12 11C10.62 11 9.5 12.12 9.5 13.5C9.5 14.88 10.62 16 12 16C13.38 16 14.5 14.88 14.5 13.5C14.5 12.12 13.38 11 12 11M7 14C5.9 14 5 14.9 5 16C5 17.1 5.9 18 7 18C8.1 18 9 17.1 9 16C9 14.9 8.1 14 7 14M17 14C15.9 14 15 14.9 15 16C15 17.1 15.9 18 17 18C18.1 18 19 17.1 19 16C19 14.9 18.1 14 17 14M7 19C5.34 19 4 20.34 4 22H10C10 20.34 8.66 19 7 19M17 19C15.34 19 14 20.34 14 22H20C20 20.34 18.66 19 17 19Z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Register Your Crop</h2>
            <p className="text-sm sm:text-base text-gray-600 font-bengali">আপনার ফসল নিবন্ধন করুন</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Crop Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Crop Type / ফসলের ধরন
                </label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
                  required
                >
                  <option value="Rice">Rice / ধান</option>
                  <option value="Paddy">Paddy / পাডি</option>
                  <option value="Wheat">Wheat / গম</option>
                  <option value="Corn">Corn / ভুট্টা</option>
                  <option value="Potato">Potato / আলু</option>
                  <option value="Vegetables">Vegetables / সবজি</option>
                  <option value="Fruits">Fruits / ফল</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Variety / জাত <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
                  placeholder="e.g., BR-28"
                />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Weight (Kg) / ওজন (কেজি)
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
                placeholder="100"
                required
              />
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Harvest Date / ফসল কাটার তারিখ
              </label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
                required
              />
            </div>

            {/* Storage Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Storage Location / সংরক্ষণের স্থান
                </label>
                <input
                  type="text"
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
                  placeholder="Location name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Storage Type / সংরক্ষণের ধরন
                </label>
                <select
                  name="storageType"
                  value={formData.storageType}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
                  required
                >
                  <option value="Warehouse">Warehouse / গুদাম</option>
                  <option value="Silo">Silo / সাইলো</option>
                  <option value="Jute Bag Stack">Jute Bag Stack / পাটের বস্তার স্তুপ</option>
                  <option value="Open Area">Open Area / খোলা এলাকা</option>
                  <option value="Cold Storage">Cold Storage / হিমাগার</option>
                  <option value="Home Storage">Home Storage / বাড়িতে সংরক্ষণ</option>
                </select>
              </div>
            </div>

            {/* Expected Duration */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Expected Storage Duration (days) / প্রত্যাশিত সংরক্ষণ সময় (দিন)
              </label>
              <input
                type="number"
                name="expectedStorageDuration"
                value={formData.expectedStorageDuration}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent"
                placeholder="30"
                required
                min="1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-600 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-lime-700 transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Registering...' : 'Register Crop / ফসল নিবন্ধন করুন'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CropRegistration

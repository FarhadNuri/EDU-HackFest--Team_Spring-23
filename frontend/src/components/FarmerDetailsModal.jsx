import { useLanguage } from '../context/LanguageContext'

const FarmerDetailsModal = ({ farmer, onClose }) => {
  const { t } = useLanguage()
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{t('Farmer Details', 'কৃষকের বিবরণ')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Farmer Info */}
          <div className="bg-lime-50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-lime-200 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-lime-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{farmer.fullname}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{farmer.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{farmer.mobile}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{farmer.district}</span>
                  </div>
                  {farmer.upazilla && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span>{farmer.upazilla}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Crops Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {t('Crops', 'ফসল')} ({farmer.crops?.length || 0})
            </h3>
            
            {!farmer.crops || farmer.crops.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t('No crops registered yet', 'এখনও কোন ফসল নিবন্ধিত হয়নি')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {farmer.crops.map((crop) => (
                  <div key={crop._id} className="border border-gray-200 rounded-lg p-4 hover:border-lime-500 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{crop.cropType}</h4>
                        {crop.variety && <p className="text-sm text-gray-500">{crop.variety}</p>}
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-lime-100 text-lime-700">
                        {crop.storageType}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('Weight', 'ওজন')}:</span>
                        <span className="font-medium">{crop.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('Harvest Date', 'ফসল কাটার তারিখ')}:</span>
                        <span className="font-medium">
                          {new Date(crop.harvestDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('Storage', 'সংরক্ষণ')}:</span>
                        <span className="font-medium">
                          {crop.storageLocation}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('Storage Duration', 'সংরক্ষণের সময়কাল')}:</span>
                        <span className="font-medium text-lime-600">
                          {crop.expectedStorageDuration} {t('days', 'দিন')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {t('Close', 'বন্ধ করুন')}
          </button>
          <a
            href={`tel:${farmer.mobile}`}
            className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {t('Call Farmer', 'কৃষককে কল করুন')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default FarmerDetailsModal

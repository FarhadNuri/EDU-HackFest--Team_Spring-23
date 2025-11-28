import { useState, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

const CropHealthScanner = ({ onClose }) => {
  const { language, t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setResult(null)
    }
  }

  const handleScan = async () => {
    if (!selectedImage) return

    setScanning(true)
    setResult(null)

    // Simulate AI API call (replace with actual HuggingFace/Teachable Machine API)
    setTimeout(() => {
      // Mock AI detection result
      const mockResults = [
        {
          status: 'Fresh',
          statusBn: 'তাজা',
          confidence: 92,
          color: 'green',
          icon: '✓',
          recommendations: [
            { en: 'Crop is in good condition', bn: 'ফসল ভালো অবস্থায় আছে' },
            { en: 'Continue current storage practices', bn: 'বর্তমান সংরক্ষণ পদ্ধতি চালিয়ে যান' },
            { en: 'Monitor humidity levels regularly', bn: 'নিয়মিত আর্দ্রতার মাত্রা পর্যবেক্ষণ করুন' }
          ]
        },
        {
          status: 'Rotten',
          statusBn: 'পচা',
          confidence: 87,
          color: 'red',
          icon: '✗',
          recommendations: [
            { en: 'Immediate action required', bn: 'অবিলম্বে ব্যবস্থা প্রয়োজন' },
            { en: 'Separate affected crops immediately', bn: 'প্রভাবিত ফসল অবিলম্বে আলাদা করুন' },
            { en: 'Check for mold or fungal growth', bn: 'ছত্রাক বা ফাংগাস বৃদ্ধি পরীক্ষা করুন' },
            { en: 'Improve ventilation in storage area', bn: 'সংরক্ষণ এলাকায় বায়ুচলাচল উন্নত করুন' }
          ]
        },
        {
          status: 'Partially Damaged',
          statusBn: 'আংশিক ক্ষতিগ্রস্ত',
          confidence: 78,
          color: 'orange',
          icon: '!',
          recommendations: [
            { en: 'Early signs of deterioration detected', bn: 'অবনতির প্রাথমিক লক্ষণ সনাক্ত' },
            { en: 'Increase monitoring frequency', bn: 'পর্যবেক্ষণের ফ্রিকোয়েন্সি বাড়ান' },
            { en: 'Consider selling or processing soon', bn: 'শীঘ্রই বিক্রয় বা প্রক্রিয়াকরণ বিবেচনা করুন' }
          ]
        }
      ]

      // Randomly select a result for demo
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setResult(randomResult)
      setScanning(false)
    }, 2000)
  }

  const handleCameraCapture = () => {
    fileInputRef.current.click()
  }

  const handleReset = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return String(num).split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('')
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
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Crop Health Scanner', 'ফসল স্বাস্থ্য স্ক্যানার')}
            </h2>
            <p className={`text-sm sm:text-base text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('AI-Powered Crop Quality Detection', 'AI-চালিত ফসলের মান সনাক্তকরণ')}
            </p>
          </div>

          {/* Upload Area */}
          {!imagePreview ? (
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              <div 
                onClick={handleCameraCapture}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className={`text-lg font-semibold text-gray-700 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Take Photo or Upload Image', 'ছবি তুলুন বা আপলোড করুন')}
                </p>
                <p className={`text-sm text-gray-500 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Click to capture or select from gallery', 'ক্যাপচার করতে বা গ্যালারি থেকে নির্বাচন করতে ক্লিক করুন')}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Image Preview */}
              <div className="mb-6">
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  <img 
                    src={imagePreview} 
                    alt="Crop preview" 
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  {scanning && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-3"></div>
                        <p className={`text-white font-semibold ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {t('Analyzing...', 'বিশ্লেষণ করা হচ্ছে...')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Result Display */}
              {result && (
                <div className="mb-6 animate-fade-in-up">
                  <div 
                    className={`rounded-xl p-6 mb-4`}
                    style={{
                      background: result.color === 'green' 
                        ? 'linear-gradient(to bottom right, #dcfce7, #bbf7d0)'
                        : result.color === 'red'
                        ? 'linear-gradient(to bottom right, #fee2e2, #fecaca)'
                        : 'linear-gradient(to bottom right, #fed7aa, #fdba74)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          result.color === 'green' ? 'bg-green-200 text-green-700' :
                          result.color === 'red' ? 'bg-red-200 text-red-700' :
                          'bg-orange-200 text-orange-700'
                        }`}>
                          {result.icon}
                        </div>
                        <div>
                          <p className={`text-sm opacity-75 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Detection Result', 'সনাক্তকরণ ফলাফল')}
                          </p>
                          <h3 className={`text-2xl font-bold ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {language === 'bn' ? result.statusBn : result.status}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm opacity-75 ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {t('Confidence', 'আত্মবিশ্বাস')}
                        </p>
                        <p className={`text-3xl font-bold ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {language === 'bn' ? toBengaliNumber(result.confidence) : result.confidence}%
                        </p>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="w-full bg-white/50 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          result.color === 'green' ? 'bg-green-600' :
                          result.color === 'red' ? 'bg-red-600' :
                          'bg-orange-600'
                        }`}
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className={`font-bold text-gray-900 mb-3 flex items-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {t('Recommendations', 'সুপারিশ')}
                    </h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className={`${
                            result.color === 'green' ? 'text-green-600' :
                            result.color === 'red' ? 'text-red-600' :
                            'text-orange-600'
                          } mt-1`}>•</span>
                          <span className={`text-sm text-gray-700 ${language === 'bn' ? 'font-bengali text-base' : ''}`}>
                            {language === 'bn' ? rec.bn : rec.en}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!result ? (
                  <>
                    <button
                      onClick={handleScan}
                      disabled={scanning}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {scanning 
                        ? t('Scanning...', 'স্ক্যান করা হচ্ছে...')
                        : t('Scan Crop', 'ফসল স্ক্যান করুন')
                      }
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      {t('Change', 'পরিবর্তন')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    {t('Scan Another', 'আরেকটি স্ক্যান করুন')}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Info Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-2 text-xs text-gray-500">
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={language === 'bn' ? 'font-bengali' : ''}>
                {t(
                  'AI-powered detection using pre-trained models. For best results, ensure good lighting and clear image of the crop.',
                  'প্রি-ট্রেইনড মডেল ব্যবহার করে AI-চালিত সনাক্তকরণ। সর্বোত্তম ফলাফলের জন্য, ভাল আলো এবং ফসলের স্পষ্ট ছবি নিশ্চিত করুন।'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropHealthScanner

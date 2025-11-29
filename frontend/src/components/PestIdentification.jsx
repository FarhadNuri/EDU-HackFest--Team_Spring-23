import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const PestIdentification = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropType, setCropType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG/PNG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (file, maxWidth = 1024, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          canvas.toBlob(
            (blob) => {
              const compressedReader = new FileReader();
              compressedReader.onloadend = () => resolve(compressedReader.result);
              compressedReader.onerror = reject;
              compressedReader.readAsDataURL(blob);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Compressing image...');
      // Compress image before sending
      const compressedImage = await compressImage(selectedImage);
      console.log('Original size:', selectedImage.size, 'bytes');
      console.log('Compressed size:', compressedImage.length, 'characters');

      // Send to backend using configured API instance
      const response = await api.post('/pest/identify', {
        image: compressedImage,
        cropType: cropType
      });

      if (response.data.success) {
        setResult(response.data.result);
        console.log('✅ Pest identified:', response.data.result);
      } else {
        setError(response.data.message || 'Failed to identify pest');
      }
    } catch (err) {
      console.error('Error identifying pest:', err);
      if (err.response?.status === 413) {
        setError('Image is too large. Please try a smaller image or take a new photo.');
      } else {
        setError(err.response?.data?.message || 'Failed to identify pest. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'Medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'Low':
        return 'bg-green-100 border-green-500 text-green-900';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900';
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High':
        return 'bg-red-600 text-white';
      case 'Medium':
        return 'bg-yellow-600 text-white';
      case 'Low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <h2 className="text-xl font-bold">{t('Pest Identification', 'কীটপতঙ্গ শনাক্তকরণ')}</h2>
              <p className="text-sm text-green-100">{t('AI-Powered Visual Analysis', 'এআই-চালিত ভিজ্যুয়াল বিশ্লেষণ')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!result ? (
            <div className="space-y-6">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {!imagePreview ? (
                  <div>
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600 mb-4">{t('Upload an image of pest or crop damage', 'কীটপতঙ্গ বা ফসলের ক্ষতির ছবি আপলোড করুন')}</p>
                    <label className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition font-semibold">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      {t('Select Image', 'ছবি নির্বাচন করুন')}
                    </label>
                    <p className="text-xs text-gray-500 mt-2">{t('JPEG or PNG, max 5MB', 'JPEG বা PNG, সর্বোচ্চ ৫MB')}</p>
                  </div>
                ) : (
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg mb-4"
                    />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      {t('Remove Image', 'ছবি সরান')}
                    </button>
                  </div>
                )}
              </div>

              {/* Crop Type Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Crop Type (Optional)', 'ফসলের ধরন (ঐচ্ছিক)')}
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">{t('Select crop type', 'ফসলের ধরন নির্বাচন করুন')}</option>
                  <option value="ধান">ধান (Rice)</option>
                  <option value="আলু">আলু (Potato)</option>
                  <option value="গম">গম (Wheat)</option>
                  <option value="ভুট্টা">ভুট্টা (Corn)</option>
                  <option value="সবজি">সবজি (Vegetables)</option>
                  <option value="ফল">ফল (Fruits)</option>
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedImage || loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('Analyzing...', 'বিশ্লেষণ করা হচ্ছে...')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {t('Identify Pest', 'কীটপতঙ্গ শনাক্ত করুন')}
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="flex justify-center">
                <img
                  src={imagePreview}
                  alt="Analyzed"
                  className="max-w-full max-h-48 rounded-lg shadow-lg"
                />
              </div>

              {/* Pest Info */}
              <div className={`border-l-4 rounded-lg p-5 ${getRiskColor(result.riskLevel)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold">{result.pestName}</h3>
                    <p className="text-sm opacity-75">{result.pestNameEnglish}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getRiskBadgeColor(result.riskLevel)}`}>
                    {result.riskLevel === 'High' ? 'উচ্চ ঝুঁকি' : result.riskLevel === 'Medium' ? 'মাঝারি ঝুঁকি' : 'কম ঝুঁকি'}
                  </span>
                </div>
                <p className="text-base leading-relaxed">{result.description}</p>
              </div>

              {/* Symptoms */}
              {result.symptoms && result.symptoms.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    লক্ষণসমূহ
                  </h4>
                  <ul className="space-y-2">
                    {result.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Immediate Actions */}
              {result.immediateActions && result.immediateActions.length > 0 && (
                <div className="bg-red-50 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    তাৎক্ষণিক পদক্ষেপ
                  </h4>
                  <ul className="space-y-2">
                    {result.immediateActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">✓</span>
                        <span className="font-medium">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Organic Treatment */}
              {result.organicTreatment && result.organicTreatment.length > 0 && (
                <div className="bg-green-50 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                    </svg>
                    জৈব/প্রাকৃতিক চিকিৎসা
                  </h4>
                  <ul className="space-y-2">
                    {result.organicTreatment.map((treatment, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">🌿</span>
                        <span>{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Chemical Treatment */}
              {result.chemicalTreatment && result.chemicalTreatment.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                    </svg>
                    রাসায়নিক চিকিৎসা
                  </h4>
                  <ul className="space-y-2">
                    {result.chemicalTreatment.map((treatment, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-600 mt-1">⚗️</span>
                        <span>{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prevention */}
              {result.prevention && result.prevention.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    প্রতিরোধমূলক ব্যবস্থা
                  </h4>
                  <ul className="space-y-2">
                    {result.prevention.map((measure, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">🛡️</span>
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Local Recommendations */}
              {result.localRecommendations && (
                <div className="bg-yellow-50 rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    স্থানীয় পরামর্শ
                  </h4>
                  <p className="leading-relaxed">{result.localRecommendations}</p>
                </div>
              )}

              {/* Analyze Another Button */}
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                  setCropType('');
                }}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                {t('Analyze Another Image', 'আরেকটি ছবি বিশ্লেষণ করুন')}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {result ? t('Analysis complete', 'বিশ্লেষণ সম্পূর্ণ') : t('Upload an image to get started', 'শুরু করতে একটি ছবি আপলোড করুন')}
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              {t('Close', 'বন্ধ করুন')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestIdentification;

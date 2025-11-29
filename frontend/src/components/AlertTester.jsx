import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AlertTester = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    cropType: 'আলু',
    weight: '500',
    storageType: 'গুদাম',
    temperature: '30',
    humidity: '85',
    weatherCondition: 'বৃষ্টি',
    tomorrowTemp: '32',
    tomorrowHumidity: '90',
    riskLevel: 'Critical'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateTestAlert = async () => {
    setLoading(true);
    setAlert(null);

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI('AIzaSyB5bEFwsdzeqaNG2KKXiTvhqrnika1UW44');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Create prompt with test data
      const prompt = `
আপনি একজন কৃষি বিশেষজ্ঞ। নিচের তথ্যের উপর ভিত্তি করে একটি সংক্ষিপ্ত, সুনির্দিষ্ট এবং কার্যকর পরামর্শ বাংলায় দিন।

ফসলের তথ্য:
- ফসলের ধরন: ${formData.cropType}
- ওজন: ${formData.weight} কেজি
- সংরক্ষণের ধরন: ${formData.storageType}
- তাপমাত্রা: ${formData.temperature}°C
- আর্দ্রতা: ${formData.humidity}%

আবহাওয়ার পূর্বাভাস:
- আজকের তাপমাত্রা: ${formData.temperature}°C
- আজকের আর্দ্রতা: ${formData.humidity}%
- আগামীকালের আবহাওয়া: ${formData.weatherCondition}
- আগামীকালের তাপমাত্রা: ${formData.tomorrowTemp}°C
- আগামীকালের আর্দ্রতা: ${formData.tomorrowHumidity}%

ঝুঁকি বিশ্লেষণ:
- ঝুঁকির মাত্রা: ${formData.riskLevel}
- সমস্যা: উচ্চ তাপমাত্রা, অতিরিক্ত আর্দ্রতা, খারাপ আবহাওয়া

নির্দেশনা:
1. ২-৩ বাক্যে সংক্ষিপ্ত পরামর্শ দিন
2. সুনির্দিষ্ট পদক্ষেপ উল্লেখ করুন (যেমন: ফ্যান চালু করুন, জানালা খুলুন, ইত্যাদি)
3. জরুরি হলে "এখনই" বা "অবিলম্বে" শব্দ ব্যবহার করুন
4. শুধুমাত্র বাংলায় উত্তর দিন

উদাহরণ (ভালো পরামর্শ):
"আগামীকাল বৃষ্টি হবে এবং আপনার আলু গুদামে আর্দ্রতা বেশি। এখনই ফ্যান চালু করুন এবং জানালা খুলে বাতাস চলাচল বাড়ান।"

এখন উপরের তথ্যের উপর ভিত্তি করে পরামর্শ দিন:
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const alertData = {
        cropType: formData.cropType,
        riskLevel: formData.riskLevel,
        message: text.trim(),
        timestamp: new Date()
      };

      setAlert(alertData);

      // Simulate SMS in console
      console.log('\n🚨 SMS NOTIFICATION SIMULATION - TEST MODE 🚨');
      console.log('═══════════════════════════════════════');
      console.log(`Farmer: Test User`);
      console.log(`Phone: +880 1234-567890`);
      console.log(`Crop: ${formData.cropType}`);
      console.log(`Risk Level: ${formData.riskLevel}`);
      console.log(`Weather: ${formData.weatherCondition}`);
      console.log(`Temperature: ${formData.temperature}°C → ${formData.tomorrowTemp}°C`);
      console.log(`Humidity: ${formData.humidity}% → ${formData.tomorrowHumidity}%`);
      console.log(`Message: ${text.trim()}`);
      console.log(`Time: ${new Date().toLocaleString('bn-BD')}`);
      console.log('═══════════════════════════════════════\n');

    } catch (error) {
      console.error('Error generating test alert:', error);
      setAlert({
        cropType: formData.cropType,
        riskLevel: formData.riskLevel,
        message: `আপনার ${formData.cropType} গুদামে তাপমাত্রা অত্যধিক (${formData.temperature}°C) এবং আর্দ্রতা বেশি (${formData.humidity}%)। আগামীকাল ${formData.weatherCondition} হবে। এখনই ফ্যান চালু করুন এবং বাতাস চলাচল বাড়ান।`,
        timestamp: new Date(),
        error: true
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Critical':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'High':
        return 'bg-orange-100 border-orange-500 text-orange-900';
      case 'Medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      default:
        return 'bg-green-100 border-green-500 text-green-900';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h2 className="text-xl font-bold">Alert System Tester</h2>
              <p className="text-sm text-purple-100">Test SMS alerts with custom data</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Test Data Input</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Type (ফসলের ধরন)
                </label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="আলু">আলু (Potato)</option>
                  <option value="ধান">ধান (Rice)</option>
                  <option value="গম">গম (Wheat)</option>
                  <option value="ভুট্টা">ভুট্টা (Corn)</option>
                  <option value="সবজি">সবজি (Vegetables)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (ওজন) - kg
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Type (সংরক্ষণের ধরন)
                </label>
                <input
                  type="text"
                  name="storageType"
                  value={formData.storageType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Temperature (তাপমাত্রা) - °C
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Humidity (আর্দ্রতা) - %
                </label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tomorrow's Weather (আগামীকালের আবহাওয়া)
                </label>
                <select
                  name="weatherCondition"
                  value={formData.weatherCondition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="বৃষ্টি">বৃষ্টি (Rain)</option>
                  <option value="ঝড়">ঝড় (Storm)</option>
                  <option value="মেঘলা">মেঘলা (Cloudy)</option>
                  <option value="রোদ">রোদ (Sunny)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tomorrow's Temperature - °C
                </label>
                <input
                  type="number"
                  name="tomorrowTemp"
                  value={formData.tomorrowTemp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tomorrow's Humidity - %
                </label>
                <input
                  type="number"
                  name="tomorrowHumidity"
                  value={formData.tomorrowHumidity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Level (ঝুঁকির মাত্রা)
                </label>
                <select
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Critical">Critical (জরুরি)</option>
                  <option value="High">High (উচ্চ)</option>
                  <option value="Medium">Medium (মাঝারি)</option>
                  <option value="Low">Low (কম)</option>
                </select>
              </div>

              <button
                onClick={generateTestAlert}
                disabled={loading}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Alert...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Test Alert
                  </>
                )}
              </button>
            </div>

            {/* Output Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Alert Output</h3>

              {!alert && !loading && (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="font-medium">No alert generated yet</p>
                  <p className="text-sm mt-1">Fill in the form and click "Generate Test Alert"</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                  <p className="text-gray-600">Generating AI-powered alert...</p>
                </div>
              )}

              {alert && (
                <div className={`border-l-4 rounded-lg p-4 ${getRiskColor(alert.riskLevel)}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{alert.cropType}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white bg-opacity-50">
                          {alert.riskLevel}
                        </span>
                      </div>
                      <p className="text-base leading-relaxed mb-2">{alert.message}</p>
                      <p className="text-xs opacity-75">
                        {alert.timestamp.toLocaleString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {alert.error && (
                        <p className="text-xs mt-2 opacity-75">
                          ⚠️ Using fallback template (Gemini API error)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {alert && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold">SMS Simulation Active</p>
                      <p className="mt-1">Check browser console (F12) for detailed SMS format</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              💡 Tip: Use high temperature (30°C+) and humidity (80%+) with rain for Critical alerts
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertTester;

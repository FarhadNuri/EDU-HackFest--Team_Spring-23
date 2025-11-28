import { useLanguage } from '../context/LanguageContext'
import { useEffect, useState } from 'react'

const Contact = ({ onNavigate }) => {
  const { language, t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100">
      {/* Contact Content Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <h1 className={`text-6xl md:text-7xl font-bold text-green-800 mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Contact Us', 'যোগাযোগ করুন')}
            </h1>
            <div className="flex items-center justify-center space-x-3 text-green-700 text-lg">
              <button 
                onClick={() => onNavigate('homepage')}
                className="hover:text-green-900 transition"
              >
                {t('Home', 'হোম')}
              </button>
              <span>›</span>
              <span>{t('Contact', 'যোগাযোগ')}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 shadow-xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <h2 className={`text-3xl font-bold text-green-800 mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Send us a Message', 'আমাদের একটি বার্তা পাঠান')}
              </h2>
              <form className="space-y-4">
                <div>
                  <label className={`block text-gray-700 font-medium mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {t('Name', 'নাম')}
                  </label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                    placeholder={language === 'bn' ? 'আপনার নাম' : 'Your name'}
                  />
                </div>
                <div>
                  <label className={`block text-gray-700 font-medium mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {t('Email', 'ইমেইল')}
                  </label>
                  <input 
                    type="email"
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                    placeholder={language === 'bn' ? 'আপনার ইমেইল' : 'Your email'}
                  />
                </div>
                <div>
                  <label className={`block text-gray-700 font-medium mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {t('Phone', 'ফোন')}
                  </label>
                  <input 
                    type="tel"
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                    placeholder={language === 'bn' ? 'আপনার ফোন নম্বর' : 'Your phone number'}
                  />
                </div>
                <div>
                  <label className={`block text-gray-700 font-medium mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {t('Message', 'বার্তা')}
                  </label>
                  <textarea 
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                    placeholder={language === 'bn' ? 'আপনার বার্তা' : 'Your message'}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className={`w-full bg-lime-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-lime-700 transition-all hover:scale-105 shadow-lg ${language === 'bn' ? 'font-bengali' : ''}`}
                >
                  {t('Send Message', 'বার্তা পাঠান')}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className={`space-y-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold text-green-800 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Address', 'ঠিকানা')}
                    </h3>
                    <p className={`text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' 
                        ? 'চট্টগ্রাম, বাংলাদেশ' 
                        : 'Chittagong, Bangladesh'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold text-green-800 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Phone', 'ফোন')}
                    </h3>
                    <p className="text-gray-700">+880 1819-541511</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold text-green-800 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Email', 'ইমেইল')}
                    </h3>
                    <p className="text-gray-700">test@harvestguard.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold text-green-800 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {t('Working Hours', 'কাজের সময়')}
                    </h3>
                    <p className={`text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' 
                        ? 'সোম - শুক্র: ৯:০০ - ১৮:০০' 
                        : 'Mon - Fri: 9:00 AM - 6:00 PM'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 shadow-xl transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <h2 className={`text-3xl font-bold text-green-800 mb-6 text-center ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Find Us', 'আমাদের খুঁজুন')}
            </h2>
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">{t('Map will be displayed here', 'এখানে মানচিত্র প্রদর্শিত হবে')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

import { useLanguage } from '../context/LanguageContext'

const Footer = ({ onNavigate }) => {
  const { language, t } = useLanguage()

  return (
    <footer className="bg-gradient-to-br from-green-800 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-8 h-8 text-lime-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4C10 4.5 10.2 5 10.59 5.41C11 5.81 11.5 6 12 6C12.5 6 13 5.81 13.41 5.41C13.81 5 14 4.5 14 4C14 3.5 13.81 3 13.41 2.59C13 2.19 12.5 2 12 2M12 7C10.9 7 10 7.9 10 9C10 9.79 10.5 10.47 11.21 10.82C9.89 11.46 9 12.86 9 14.5C9 15.14 9.12 15.75 9.34 16.31C8.5 15.5 8 14.3 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 14.3 15.5 15.5 14.66 16.31C14.88 15.75 15 15.14 15 14.5C15 12.86 14.11 11.46 12.79 10.82C13.5 10.47 14 9.79 14 9C14 7.9 13.1 7 12 7M12 11C10.62 11 9.5 12.12 9.5 13.5C9.5 14.88 10.62 16 12 16C13.38 16 14.5 14.88 14.5 13.5C14.5 12.12 13.38 11 12 11M7 14C5.9 14 5 14.9 5 16C5 17.1 5.9 18 7 18C8.1 18 9 17.1 9 16C9 14.9 8.1 14 7 14M17 14C15.9 14 15 14.9 15 16C15 17.1 15.9 18 17 18C18.1 18 19 17.1 19 16C19 14.9 18.1 14 17 14M7 19C5.34 19 4 20.34 4 22H10C10 20.34 8.66 19 7 19M17 19C15.34 19 14 20.34 14 22H20C20 20.34 18.66 19 17 19Z" />
              </svg>
              <span className="text-xl font-bold">HarvestGuard</span>
            </div>
            <p className={`text-green-200 text-sm ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t(
                'Protecting harvests, ensuring food security for Bangladesh.',
                'ফসল রক্ষা করা, বাংলাদেশের জন্য খাদ্য নিরাপত্তা নিশ্চিত করা।'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Quick Links', 'দ্রুত লিঙ্ক')}
            </h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('homepage')}
                  className={`text-green-200 hover:text-lime-400 transition ${language === 'bn' ? 'font-bengali' : ''}`}
                >
                  {t('Home', 'হোম')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className={`text-green-200 hover:text-lime-400 transition ${language === 'bn' ? 'font-bengali' : ''}`}
                >
                  {t('About Us', 'আমাদের সম্পর্কে')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('features')}
                  className={`text-green-200 hover:text-lime-400 transition ${language === 'bn' ? 'font-bengali' : ''}`}
                >
                  {t('Features', 'বৈশিষ্ট্য')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')}
                  className={`text-green-200 hover:text-lime-400 transition ${language === 'bn' ? 'font-bengali' : ''}`}
                >
                  {t('Contact', 'যোগাযোগ')}
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Features', 'বৈশিষ্ট্য')}
            </h3>
            <ul className={`space-y-2 text-green-200 text-sm ${language === 'bn' ? 'font-bengali' : ''}`}>
              <li>{t('Real-Time Monitoring', 'রিয়েল-টাইম মনিটরিং')}</li>
              <li>{t('AI Predictions', 'AI পূর্বাভাস')}</li>
              <li>{t('Smart Alerts', 'স্মার্ট সতর্কতা')}</li>
              <li>{t('Weather Integration', 'আবহাওয়া একীকরণ')}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Contact Info', 'যোগাযোগের তথ্য')}
            </h3>
            <ul className="space-y-3 text-green-200 text-sm">
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={language === 'bn' ? 'font-bengali' : ''}>
                  {language === 'bn' ? 'চট্টগ্রাম, বাংলাদেশ' : 'Chittagong, Bangladesh'}
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>test@harvestguard.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+880 1819-541511</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-green-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 bg-green-700 hover:bg-lime-600 rounded-full flex items-center justify-center transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-green-700 hover:bg-lime-600 rounded-full flex items-center justify-center transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-green-700 hover:bg-lime-600 rounded-full flex items-center justify-center transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <p className={`text-green-200 text-sm ${language === 'bn' ? 'font-bengali' : ''}`}>
              © 2024 HarvestGuard. {t('All rights reserved.', 'সর্বস্বত্ব সংরক্ষিত।')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

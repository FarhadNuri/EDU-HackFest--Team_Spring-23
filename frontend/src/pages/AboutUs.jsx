import { useLanguage } from '../context/LanguageContext'
import { useEffect, useState } from 'react'

const AboutUs = ({ onNavigate }) => {
  const { language, t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100">
      {/* About Us Content Section */}
      <section className="relative py-20 overflow-hidden">
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <h1 className={`text-6xl md:text-7xl font-bold text-green-800 mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('About Us', 'আমাদের সম্পর্কে')}
            </h1>
            <div className="flex items-center justify-center space-x-3 text-green-700 text-lg">
              <button 
                onClick={() => onNavigate('homepage')}
                className="hover:text-green-900 transition"
              >
                {t('Home', 'হোম')}
              </button>
              <span>›</span>
              <span>{t('About Us', 'আমাদের সম্পর্কে')}</span>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className={`text-3xl font-bold text-green-800 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Our Mission', 'আমাদের লক্ষ্য')}
              </h2>
              <p className={`text-gray-700 leading-relaxed text-lg ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t(
                  'To reduce food loss in Bangladesh by providing farmers with real-time monitoring, AI-powered predictions, and actionable insights to protect their harvests.',
                  'রিয়েল-টাইম মনিটরিং, AI-চালিত পূর্বাভাস এবং তাদের ফসল রক্ষার জন্য কার্যকর অন্তর্দৃষ্টি প্রদান করে বাংলাদেশে খাদ্য ক্ষতি হ্রাস করা।'
                )}
              </p>
            </div>

            <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className={`text-3xl font-bold text-green-800 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Our Vision', 'আমাদের দৃষ্টিভঙ্গি')}
              </h2>
              <p className={`text-gray-700 leading-relaxed text-lg ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t(
                  'A future where no farmer loses their hard-earned harvest to preventable causes, ensuring food security and prosperity for all.',
                  'এমন একটি ভবিষ্যত যেখানে কোনো কৃষক প্রতিরোধযোগ্য কারণে তাদের কঠোর পরিশ্রমের ফসল হারাবে না, সবার জন্য খাদ্য নিরাপত্তা এবং সমৃদ্ধি নিশ্চিত করবে।'
                )}
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-10 border-2 border-green-200 shadow-xl mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <h2 className={`text-4xl font-bold text-green-800 text-center mb-8 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Our Story', 'আমাদের গল্প')}
            </h2>
            <div className={`text-gray-700 leading-relaxed space-y-6 text-lg ${language === 'bn' ? 'font-bengali' : ''}`}>
              <p>
                {t(
                  'HarvestGuard was born from a simple observation: millions of tonnes of food are lost every year in Bangladesh due to poor storage conditions, lack of real-time monitoring, and inadequate weather information.',
                  'HarvestGuard একটি সাধারণ পর্যবেক্ষণ থেকে জন্ম নিয়েছে: খারাপ সংরক্ষণ অবস্থা, রিয়েল-টাইম মনিটরিংয়ের অভাব এবং অপর্যাপ্ত আবহাওয়া তথ্যের কারণে বাংলাদেশে প্রতি বছর লক্ষ লক্ষ টন খাদ্য নষ্ট হয়।'
                )}
              </p>
              <p>
                {t(
                  'Founded in 2024, we combine IoT sensors, AI predictions, and mobile technology to give farmers the tools they need to protect their harvests. Our platform is designed specifically for Bangladeshi farmers, with bilingual support and features tailored to local needs.',
                  '২০২৪ সালে প্রতিষ্ঠিত, আমরা কৃষকদের তাদের ফসল রক্ষার জন্য প্রয়োজনীয় সরঞ্জাম দিতে IoT সেন্সর, AI পূর্বাভাস এবং মোবাইল প্রযুক্তি একত্রিত করি। আমাদের প্ল্যাটফর্মটি বিশেষভাবে বাংলাদেশী কৃষকদের জন্য ডিজাইন করা হয়েছে, দ্বিভাষিক সমর্থন এবং স্থানীয় চাহিদার জন্য উপযুক্ত বৈশিষ্ট্য সহ।'
                )}
              </p>
            </div>
          </div>

          {/* Impact Stats */}
          <div className={`bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-10 border-2 border-green-500 shadow-2xl mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '800ms' }}
          >
            <h2 className={`text-4xl font-bold text-white text-center mb-12 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Our Impact', 'আমাদের প্রভাব')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className={`text-6xl font-bold text-white mb-3 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {language === 'bn' ? '১০,০০০+' : '10,000+'}
                </p>
                <p className={`text-lime-100 text-lg ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Farmers', 'কৃষক')}
                </p>
              </div>
              <div className="text-center">
                <p className={`text-6xl font-bold text-white mb-3 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {language === 'bn' ? '৫০০+' : '500+'}
                </p>
                <p className={`text-lime-100 text-lg ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Tons Saved', 'টন সংরক্ষিত')}
                </p>
              </div>
              <div className="text-center">
                <p className={`text-6xl font-bold text-white mb-3 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {language === 'bn' ? '৬৪' : '64'}
                </p>
                <p className={`text-lime-100 text-lg ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Districts', 'জেলা')}
                </p>
              </div>
              <div className="text-center">
                <p className={`text-6xl font-bold text-white mb-3 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {language === 'bn' ? '৯৫%' : '95%'}
                </p>
                <p className={`text-lime-100 text-lg ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Success Rate', 'সফলতার হার')}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '1000ms' }}
          >
            <h2 className={`text-4xl font-bold text-green-800 mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Join Us in Our Mission', 'আমাদের মিশনে যোগ দিন')}
            </h2>
            <p className={`text-xl text-gray-700 mb-8 max-w-2xl mx-auto ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t(
                'Together, we can reduce food loss and ensure food security for Bangladesh',
                'একসাথে, আমরা খাদ্য ক্ষতি কমাতে এবং বাংলাদেশের জন্য খাদ্য নিরাপত্তা নিশ্চিত করতে পারি'
              )}
            </p>
            <button 
              onClick={() => onNavigate('dashboard')}
              className={`bg-lime-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-lime-700 transition-all hover:scale-105 shadow-xl ${language === 'bn' ? 'font-bengali' : ''}`}
            >
              {t('Get Started Today', 'আজই শুরু করুন')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs

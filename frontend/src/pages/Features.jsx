import { useLanguage } from '../context/LanguageContext'
import { useEffect, useState } from 'react'

const Features = ({ onNavigate }) => {
  const { language, t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Real-Time Monitoring',
      titleBn: 'রিয়েল-টাইম মনিটরিং',
      description: 'Track temperature, humidity, and storage conditions 24/7 with IoT sensors.',
      descriptionBn: 'IoT সেন্সর দিয়ে ২৪/৭ তাপমাত্রা, আর্দ্রতা এবং সংরক্ষণ অবস্থা ট্র্যাক করুন।',
      color: 'lime'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'AI-Powered Predictions',
      titleBn: 'AI-চালিত পূর্বাভাস',
      description: 'Get intelligent forecasts for crop spoilage risks and optimal harvest times.',
      descriptionBn: 'ফসল নষ্ট হওয়ার ঝুঁকি এবং সর্বোত্তম ফসল কাটার সময়ের জন্য বুদ্ধিমান পূর্বাভাস পান।',
      color: 'green'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Smart Alerts',
      titleBn: 'স্মার্ট সতর্কতা',
      description: 'Receive instant notifications when conditions threaten your harvest.',
      descriptionBn: 'যখন অবস্থা আপনার ফসলকে হুমকি দেয় তখন তাৎক্ষণিক বিজ্ঞপ্তি পান।',
      color: 'orange'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      title: 'Weather Integration',
      titleBn: 'আবহাওয়া একীকরণ',
      description: 'Access hyperlocal weather forecasts to plan your storage and harvest.',
      descriptionBn: 'আপনার সংরক্ষণ এবং ফসল পরিকল্পনা করতে হাইপারলোকাল আবহাওয়া পূর্বাভাস অ্যাক্সেস করুন।',
      color: 'cyan'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Crop Health Scanner',
      titleBn: 'ফসল স্বাস্থ্য স্ক্যানার',
      description: 'Use AI image recognition to detect diseases and pests early.',
      descriptionBn: 'রোগ এবং কীটপতঙ্গ তাড়াতাড়ি সনাক্ত করতে AI ইমেজ রিকগনিশন ব্যবহার করুন।',
      color: 'emerald'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      title: 'Analytics Dashboard',
      titleBn: 'বিশ্লেষণ ড্যাশবোর্ড',
      description: 'Visualize trends, track losses, and optimize your storage strategy.',
      descriptionBn: 'প্রবণতা ভিজ্যুয়ালাইজ করুন, ক্ষতি ট্র্যাক করুন এবং আপনার সংরক্ষণ কৌশল অপ্টিমাইজ করুন।',
      color: 'blue'
    }
  ]

  const colorClasses = {
    lime: 'bg-lime-500',
    green: 'bg-green-600',
    orange: 'bg-orange-500',
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100">
      {/* Features Content Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <h1 className={`text-6xl md:text-7xl font-bold text-green-800 mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Features', 'বৈশিষ্ট্য')}
            </h1>
            <div className="flex items-center justify-center space-x-3 text-green-700 text-lg">
              <button 
                onClick={() => onNavigate('homepage')}
                className="hover:text-green-900 transition"
              >
                {t('Home', 'হোম')}
              </button>
              <span>›</span>
              <span>{t('Features', 'বৈশিষ্ট্য')}</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className={`w-16 h-16 ${colorClasses[feature.color]} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-bold text-green-800 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {language === 'bn' ? feature.titleBn : feature.title}
                </h3>
                <p className={`text-gray-700 leading-relaxed ${language === 'bn' ? 'font-bengali text-lg' : ''}`}>
                  {language === 'bn' ? feature.descriptionBn : feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Why Choose Us Section */}
          <div className={`bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-10 border-2 border-green-500 shadow-2xl mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '900ms' }}
          >
            <h2 className={`text-4xl font-bold text-white text-center mb-8 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Why Choose HarvestGuard?', 'কেন HarvestGuard বেছে নেবেন?')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {language === 'bn' ? '৯৯.৯%' : '99.9%'}
                </div>
                <p className={`text-lime-100 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Uptime Reliability', 'আপটাইম নির্ভরযোগ্যতা')}
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {language === 'bn' ? '২৪/৭' : '24/7'}
                </div>
                <p className={`text-lime-100 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Support Available', 'সহায়তা উপলব্ধ')}
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {language === 'bn' ? '২' : '2'}
                </div>
                <p className={`text-lime-100 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('Languages Supported', 'ভাষা সমর্থিত')}
                </p>
              </div>
            </div>
          </div>

          {/* Sign In Required Section */}
          <div className={`bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-10 border-2 border-orange-300 shadow-xl mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '1000ms' }}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className={`text-3xl font-bold text-orange-800 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Sign In Required', 'সাইন ইন প্রয়োজন')}
              </h3>
              <p className={`text-lg text-gray-700 mb-6 max-w-2xl mx-auto ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t(
                  'To access these powerful features and start protecting your harvest, please sign in to your account or create a new one.',
                  'এই শক্তিশালী বৈশিষ্ট্যগুলি অ্যাক্সেস করতে এবং আপনার ফসল রক্ষা শুরু করতে, অনুগ্রহ করে আপনার অ্যাকাউন্টে সাইন ইন করুন বা একটি নতুন তৈরি করুন।'
                )}
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '1100ms' }}
          >
            <h2 className={`text-4xl font-bold text-green-800 mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Ready to Protect Your Harvest?', 'আপনার ফসল রক্ষা করতে প্রস্তুত?')}
            </h2>
            <p className={`text-xl text-gray-700 mb-8 max-w-2xl mx-auto ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t(
                'Join thousands of farmers who trust HarvestGuard to reduce food loss',
                'হাজার হাজার কৃষকদের সাথে যোগ দিন যারা খাদ্য ক্ষতি কমাতে HarvestGuard বিশ্বাস করেন'
              )}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className={`bg-lime-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-lime-700 transition-all hover:scale-105 shadow-xl ${language === 'bn' ? 'font-bengali' : ''}`}
              >
                {t('Sign In', 'সাইন ইন')}
              </button>
              <button 
                onClick={() => onNavigate('homepage')}
                className={`bg-white text-green-700 border-2 border-green-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-all hover:scale-105 shadow-xl ${language === 'bn' ? 'font-bengali' : ''}`}
              >
                {t('Back to Home', 'হোমে ফিরে যান')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features

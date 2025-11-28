import { useState, useEffect } from 'react'
import WorkflowCard from '../components/WorkflowCard'
import AnimatedSupplyChain from '../components/AnimatedSupplyChain'
import { useLanguage } from '../context/LanguageContext'

const Homepage = ({ onLoginClick, onSignupClick, onNavigate }) => {
  const { language, toggleLanguage, t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [aboutVisible, setAboutVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)

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

  const farmingImages = [
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=600&fit=crop',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=600&fit=crop',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&h=600&fit=crop',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=600&fit=crop',
  ]

  const extendedImages = [...farmingImages, farmingImages[0]]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setCurrentSlide((prev) => prev + 1)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (currentSlide === farmingImages.length) {
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide(0)
      }, 1000)
    }
  }, [currentSlide, farmingImages.length])

  useEffect(() => {
    // Scroll observer for About Us and Features sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'about-section') {
              setAboutVisible(true)
            } else if (entry.target.id === 'features-section') {
              setFeaturesVisible(true)
            } else if (entry.target.id === 'contact-section') {
              setContactVisible(true)
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    const aboutSection = document.getElementById('about-section')
    const featuresSection = document.getElementById('features-section')
    const contactSection = document.getElementById('contact-section')
    
    if (aboutSection) {
      observer.observe(aboutSection)
    }
    if (featuresSection) {
      observer.observe(featuresSection)
    }
    if (contactSection) {
      observer.observe(contactSection)
    }

    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection)
      }
      if (featuresSection) {
        observer.unobserve(featuresSection)
      }
      if (contactSection) {
        observer.unobserve(contactSection)
      }
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4C10 4.5 10.2 5 10.59 5.41C11 5.81 11.5 6 12 6C12.5 6 13 5.81 13.41 5.41C13.81 5 14 4.5 14 4C14 3.5 13.81 3 13.41 2.59C13 2.19 12.5 2 12 2M12 7C10.9 7 10 7.9 10 9C10 9.79 10.5 10.47 11.21 10.82C9.89 11.46 9 12.86 9 14.5C9 15.14 9.12 15.75 9.34 16.31C8.5 15.5 8 14.3 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 14.3 15.5 15.5 14.66 16.31C14.88 15.75 15 15.14 15 14.5C15 12.86 14.11 11.46 12.79 10.82C13.5 10.47 14 9.79 14 9C14 7.9 13.1 7 12 7M12 11C10.62 11 9.5 12.12 9.5 13.5C9.5 14.88 10.62 16 12 16C13.38 16 14.5 14.88 14.5 13.5C14.5 12.12 13.38 11 12 11M7 14C5.9 14 5 14.9 5 16C5 17.1 5.9 18 7 18C8.1 18 9 17.1 9 16C9 14.9 8.1 14 7 14M17 14C15.9 14 15 14.9 15 16C15 17.1 15.9 18 17 18C18.1 18 19 17.1 19 16C19 14.9 18.1 14 17 14M7 19C5.34 19 4 20.34 4 22H10C10 20.34 8.66 19 7 19M17 19C15.34 19 14 20.34 14 22H20C20 20.34 18.66 19 17 19Z" />
            </svg>
            <span className="text-xl font-bold text-white">HarvestGuard</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <a href="#home" className="text-white px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/50 hover:text-gray-900 hover:scale-105">
              {t('Home', 'হোম')}
            </a>
            <button 
              onClick={() => onNavigate('about')}
              className="text-white px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/50 hover:text-gray-900 hover:scale-105"
            >
              {t('About Us', 'আমাদের সম্পর্কে')}
            </button>
            <button 
              onClick={() => onNavigate('features')}
              className="text-white px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/50 hover:text-gray-900 hover:scale-105"
            >
              {t('Features', 'বৈশিষ্ট্য')}
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="text-white px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/50 hover:text-gray-900 hover:scale-105"
            >
              {t('Contact', 'যোগাযোগ')}
            </button>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={onLoginClick}
              className="bg-lime-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-lime-700 transition text-sm sm:text-base"
            >
              {t('Login', 'লগইন')}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-white"
              title={language === 'en' ? 'Switch to Bangla' : 'Switch to English'}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">{language === 'en' ? 'বাং' : 'EN'}</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Images Slider */}
        <div className="absolute inset-0 flex">
          {extendedImages.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${image}')`,
                transform: `translateX(${(index - currentSlide) * 100}%)`,
                transition: isTransitioning ? 'transform 1000ms ease-in-out' : 'none',
              }}
            />
          ))}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 z-10">
          <div className="text-center">
            {/* Title */}
            <h1 className={`text-4xl md:text-6xl font-bold text-white/70 mb-4 leading-tight ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t(
                'Bangladesh loses 4.5 million tonnes of food every year.',
                'বাংলাদেশে বছরে ৪.৫ মিলিয়ন টন খাদ্য নষ্ট হয়।'
              )}
            </h1>
            
            {/* Description */}
            <p className={`text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t(
                'Storage, moisture, weather, and poor handling cause the losses.',
                'সংরক্ষণ, আর্দ্রতা, আবহাওয়া ও ভুল হ্যান্ডলিং — এই কারণেই খাবার নষ্ট।'
              )}
            </p>
            
            {/* CTA Button */}
            <button 
              onClick={onSignupClick}
              className={`bg-lime-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-lime-700 transition-all hover:scale-105 shadow-xl mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}
            >
              {t('Start Now', 'এখনই শুরু করুন')}
            </button>
            
            {/* Trust Badge */}
            <p className={`text-sm text-white/90 mb-8 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t(
                '✓ Trusted by Bangladeshi farmers | Powered by real-time data',
                '✓ বাংলাদেশী কৃষকদের দ্বারা বিশ্বস্ত | রিয়েল-টাইম ডেটা দ্বারা চালিত'
              )}
            </p>
            
            {/* Workflow Card - Core App Workflow */}
            <WorkflowCard />
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-10">
          {farmingImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true)
                setCurrentSlide(index)
              }}
              className="relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === (currentSlide % farmingImages.length)
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 scale-100'
                }`}
              />
              {index === (currentSlide % farmingImages.length) && (
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-white animate-ping opacity-75" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Animated Supply Chain Section */}
      <AnimatedSupplyChain />

      {/* About Us Content Section (without heading) */}
      <section id="about-section" className="relative py-20 bg-gradient-to-br from-white via-green-50 to-green-100 overflow-hidden">
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`text-3xl font-bold text-green-800 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Our Mission', 'আমাদের লক্ষ্য')}
              </h3>
              <p className={`text-gray-700 leading-relaxed text-lg ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t(
                  'To reduce food loss in Bangladesh by providing farmers with real-time monitoring, AI-powered predictions, and actionable insights to protect their harvests.',
                  'রিয়েল-টাইম মনিটরিং, AI-চালিত পূর্বাভাস এবং তাদের ফসল রক্ষার জন্য কার্যকর অন্তর্দৃষ্টি প্রদান করে বাংলাদেশে খাদ্য ক্ষতি হ্রাস করা।'
                )}
              </p>
            </div>

            <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className={`text-3xl font-bold text-green-800 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Our Vision', 'আমাদের দৃষ্টিভঙ্গি')}
              </h3>
              <p className={`text-gray-700 leading-relaxed text-lg ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t(
                  'A future where no farmer loses their hard-earned harvest to preventable causes, ensuring food security and prosperity for all.',
                  'এমন একটি ভবিষ্যত যেখানে কোনো কৃষক প্রতিরোধযোগ্য কারণে তাদের কঠোর পরিশ্রমের ফসল হারাবে না, সবার জন্য খাদ্য নিরাপত্তা এবং সমৃদ্ধি নিশ্চিত করবে।'
                )}
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-10 border-2 border-green-200 shadow-xl mb-16 transition-all duration-700 ${aboutVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <h3 className={`text-4xl font-bold text-green-800 text-center mb-8 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Our Story', 'আমাদের গল্প')}
            </h3>
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
          <div className={`bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-10 border-2 border-green-500 shadow-2xl mb-16 transition-all duration-700 ${aboutVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '800ms' }}
          >
            <h3 className={`text-4xl font-bold text-white text-center mb-12 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Our Impact', 'আমাদের প্রভাব')}
            </h3>
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
          <div className={`text-center transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '1000ms' }}
          >
            <h3 className={`text-4xl font-bold text-green-800 mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Join Us in Our Mission', 'আমাদের মিশনে যোগ দিন')}
            </h3>
            <p className={`text-xl text-gray-700 mb-8 max-w-2xl mx-auto ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t(
                'Together, we can reduce food loss and ensure food security for Bangladesh',
                'একসাথে, আমরা খাদ্য ক্ষতি কমাতে এবং বাংলাদেশের জন্য খাদ্য নিরাপত্তা নিশ্চিত করতে পারি'
              )}
            </p>
            <button 
              onClick={onSignupClick}
              className={`bg-lime-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-lime-700 transition-all hover:scale-105 shadow-xl ${language === 'bn' ? 'font-bengali' : ''}`}
            >
              {t('Get Started Today', 'আজই শুরু করুন')}
            </button>
          </div>
        </div>
      </section>

      {/* Features Content Section (without heading) */}
      <section id="features-section" className="relative py-20 bg-gradient-to-br from-white via-green-50 to-green-100 overflow-hidden">
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-white backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
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
          <div className={`bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-10 border-2 border-green-500 shadow-2xl transition-all duration-700 ${featuresVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '900ms' }}
          >
            <h3 className={`text-4xl font-bold text-white text-center mb-8 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Why Choose HarvestGuard?', 'কেন HarvestGuard বেছে নেবেন?')}
            </h3>
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
        </div>
      </section>

      {/* Contact Content Section (without heading) */}
      <section id="contact-section" className="relative py-20 bg-gradient-to-br from-white via-green-50 to-green-100 overflow-hidden">
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 shadow-xl transition-all duration-700 ${contactVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
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
            <div className={`space-y-6 transition-all duration-700 ${contactVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
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
                      {language === 'bn' ? 'চট্টগ্রাম, বাংলাদেশ' : 'Chittagong, Bangladesh'}
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
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage

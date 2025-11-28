import { useState, useEffect } from 'react'
import WorkflowCard from '../components/WorkflowCard'
import AnimatedSupplyChain from '../components/AnimatedSupplyChain'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { useLanguage } from '../context/LanguageContext'

const Homepage = ({ onLoginSuccess, onShowDashboard }) => {
  const { language, toggleLanguage, t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

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
            <a href="#" className="text-white px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/50 hover:text-gray-900 hover:scale-105">
              {t('Home', 'হোম')}
            </a>
            <a href="#" className="text-white px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/50 hover:text-gray-900 hover:scale-105">
              {t('About Us', 'আমাদের সম্পর্কে')}
            </a>
            <a href="#" className="text-white px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/50 hover:text-gray-900 hover:scale-105">
              {t('Features', 'বৈশিষ্ট্য')}
            </a>
            <a href="#" className="text-white px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/50 hover:text-gray-900 hover:scale-105">
              {t('Contact', 'যোগাযোগ')}
            </a>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={() => setShowLogin(true)}
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
      <section className="relative min-h-screen flex items-center overflow-hidden">
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
                'Bangladesh loses X million tonnes of food every year.',
                'বাংলাদেশে বছরে X মিলিয়ন টন খাদ্য নষ্ট হয়।'
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
              onClick={() => setShowSignup(true)}
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

      {/* Login Modal */}
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false)
            setShowSignup(true)
          }}
          onSuccess={() => {
            setShowLogin(false)
            if (onLoginSuccess) onLoginSuccess()
          }}
        />
      )}

      {/* Signup Modal */}
      {showSignup && (
        <Signup 
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false)
            setShowLogin(true)
          }}
          onSuccess={() => {
            setShowSignup(false)
            setShowLogin(true)
          }}
        />
      )}
    </div>
  )
}

export default Homepage

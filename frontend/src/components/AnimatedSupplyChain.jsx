import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const AnimatedSupplyChain = () => {
  const { language, t } = useLanguage()
  
  const steps = [
    {
      icon: 'harvest',
      title: 'Harvest',
      titleBn: 'ফসল কাটা',
      description: 'Risk increases after harvest',
      descriptionBn: 'কাটার পর থেকেই ঝুঁকি বাড়ে',
      color: 'green',
      delay: '0s'
    },
    {
      icon: 'transport',
      title: 'Transport',
      titleBn: 'পরিবহন',
      description: 'Poor handling damages food',
      descriptionBn: 'ভুল হ্যান্ডলিংয়ে খাবার নষ্ট হয়',
      color: 'cyan',
      delay: '0.7s'
    },
    {
      icon: 'storage',
      title: 'Storage',
      titleBn: 'সংরক্ষণ',
      description: 'Humidity & temperature rise',
      descriptionBn: 'আর্দ্রতা ও তাপমাত্রা বেড়ে যায়',
      color: 'yellow',
      delay: '1.4s'
    },
    {
      icon: 'risk',
      title: 'Risk',
      titleBn: 'ঝুঁকি',
      description: 'Fungus & pest attacks',
      descriptionBn: 'ফাংগাস ও পোকা আক্রমণ',
      color: 'red',
      delay: '2.1s'
    },
    {
      icon: 'loss',
      title: 'Loss',
      titleBn: 'ক্ষতি',
      description: 'Economic loss',
      descriptionBn: 'অর্থনৈতিক ক্ষতি',
      color: 'pink',
      delay: '2.8s'
    }
  ]

  return (
    <section className="bg-gradient-to-br from-white via-green-50 to-green-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
            {t(
              'Where Food Loss Happens in Bangladesh',
              'বাংলাদেশে খাদ্য ক্ষতি কোথায় হয় – ধাপে ধাপে'
            )}
          </h2>
        </div>

        {/* Animated Supply Chain */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center"
                style={{ animationDelay: step.delay }}
              >
                {/* Icon Container */}
                {step.icon === 'harvest' && (
                  <div 
                    className="w-20 h-20 rounded-full bg-green-200 flex items-center justify-center mb-4 relative group transition-all duration-300 hover:bg-green-300 animate-fade-in-up"
                    style={{ animationDelay: step.delay }}
                  >
                    <svg className="w-10 h-10 text-green-700 transition-all duration-300 group-hover:text-green-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4C10 4.5 10.2 5 10.59 5.41C11 5.81 11.5 6 12 6C12.5 6 13 5.81 13.41 5.41C13.81 5 14 4.5 14 4C14 3.5 13.81 3 13.41 2.59C13 2.19 12.5 2 12 2M12 7C10.9 7 10 7.9 10 9C10 9.79 10.5 10.47 11.21 10.82C9.89 11.46 9 12.86 9 14.5C9 15.14 9.12 15.75 9.34 16.31C8.5 15.5 8 14.3 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 14.3 15.5 15.5 14.66 16.31C14.88 15.75 15 15.14 15 14.5C15 12.86 14.11 11.46 12.79 10.82C13.5 10.47 14 9.79 14 9C14 7.9 13.1 7 12 7M12 11C10.62 11 9.5 12.12 9.5 13.5C9.5 14.88 10.62 16 12 16C13.38 16 14.5 14.88 14.5 13.5C14.5 12.12 13.38 11 12 11M7 14C5.9 14 5 14.9 5 16C5 17.1 5.9 18 7 18C8.1 18 9 17.1 9 16C9 14.9 8.1 14 7 14M17 14C15.9 14 15 14.9 15 16C15 17.1 15.9 18 17 18C18.1 18 19 17.1 19 16C19 14.9 18.1 14 17 14M7 19C5.34 19 4 20.34 4 22H10C10 20.34 8.66 19 7 19M17 19C15.34 19 14 20.34 14 22H20C20 20.34 18.66 19 17 19Z" />
                    </svg>
                  </div>
                )}
                
                {step.icon === 'transport' && (
                  <div 
                    className="w-20 h-20 rounded-full bg-cyan-200 flex items-center justify-center mb-4 relative group transition-all duration-300 hover:bg-cyan-300 animate-fade-in-up"
                    style={{ animationDelay: step.delay }}
                  >
                    <svg className="w-10 h-10 text-cyan-700 transition-all duration-300 group-hover:text-cyan-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 014.5 17 1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 17 1.5 1.5 0 016 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 003 3 3 3 0 003-3h6a3 3 0 003 3 3 3 0 003-3h2v-5l-3-4z" />
                    </svg>
                  </div>
                )}
                
                {step.icon === 'storage' && (
                  <div 
                    className="w-20 h-20 rounded-full bg-yellow-200 flex items-center justify-center mb-4 relative group transition-all duration-300 hover:bg-yellow-300 animate-fade-in-up"
                    style={{ animationDelay: step.delay }}
                  >
                    <svg className="w-10 h-10 text-yellow-700 transition-all duration-300 group-hover:text-yellow-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                  </div>
                )}
                
                {step.icon === 'risk' && (
                  <div 
                    className="w-20 h-20 rounded-full bg-red-200 flex items-center justify-center mb-4 relative group transition-all duration-300 hover:bg-red-300 animate-fade-in-up"
                    style={{ animationDelay: step.delay }}
                  >
                    <svg className="w-10 h-10 text-red-700 transition-all duration-300 group-hover:text-red-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 14h-2V9h2m0 9h-2v-2h2M1 21h22L12 2 1 21z" />
                    </svg>
                  </div>
                )}
                
                {step.icon === 'loss' && (
                  <div 
                    className="w-20 h-20 rounded-full bg-pink-200 flex items-center justify-center mb-4 relative group transition-all duration-300 hover:bg-pink-300 animate-fade-in-up"
                    style={{ animationDelay: step.delay }}
                  >
                    <svg className="w-10 h-10 text-pink-700 transition-all duration-300 group-hover:text-pink-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z" />
                    </svg>
                  </div>
                )}

                {/* Labels */}
                <h3 className={`text-base font-semibold text-gray-900 mb-1 animate-fade-in-up ${language === 'bn' ? 'font-bengali' : ''}`} style={{ animationDelay: `calc(${step.delay} + 0.1s)` }}>
                  {t(step.title, step.titleBn)}
                </h3>
                <p className={`text-xs text-gray-600 leading-relaxed animate-fade-in-up ${language === 'bn' ? 'font-bengali' : ''}`} style={{ animationDelay: `calc(${step.delay} + 0.2s)` }}>
                  {t(step.description, step.descriptionBn)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnimatedSupplyChain

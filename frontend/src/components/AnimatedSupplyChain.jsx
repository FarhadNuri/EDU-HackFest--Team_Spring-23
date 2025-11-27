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
    <section className="bg-gray-50 py-20">
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
                <div 
                  className={`w-20 h-20 rounded-full bg-${step.color}-200 flex items-center justify-center mb-4 relative group transition-all duration-300 hover:bg-${step.color}-400 animate-fade-in-up`}
                  style={{ animationDelay: step.delay }}
                >
                  {step.icon === 'harvest' && (
                    <svg className="w-10 h-10 text-green-700 transition-all duration-300 group-hover:text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path className="transition-all duration-300 group-hover:fill-green-700" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4C10 4.5 10.2 5 10.59 5.41C11 5.81 11.5 6 12 6C12.5 6 13 5.81 13.41 5.41C13.81 5 14 4.5 14 4C14 3.5 13.81 3 13.41 2.59C13 2.19 12.5 2 12 2M12 7C10.9 7 10 7.9 10 9C10 9.79 10.5 10.47 11.21 10.82C9.89 11.46 9 12.86 9 14.5C9 15.14 9.12 15.75 9.34 16.31C8.5 15.5 8 14.3 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 14.3 15.5 15.5 14.66 16.31C14.88 15.75 15 15.14 15 14.5C15 12.86 14.11 11.46 12.79 10.82C13.5 10.47 14 9.79 14 9C14 7.9 13.1 7 12 7M12 11C10.62 11 9.5 12.12 9.5 13.5C9.5 14.88 10.62 16 12 16C13.38 16 14.5 14.88 14.5 13.5C14.5 12.12 13.38 11 12 11M7 14C5.9 14 5 14.9 5 16C5 17.1 5.9 18 7 18C8.1 18 9 17.1 9 16C9 14.9 8.1 14 7 14M17 14C15.9 14 15 14.9 15 16C15 17.1 15.9 18 17 18C18.1 18 19 17.1 19 16C19 14.9 18.1 14 17 14M7 19C5.34 19 4 20.34 4 22H10C10 20.34 8.66 19 7 19M17 19C15.34 19 14 20.34 14 22H20C20 20.34 18.66 19 17 19Z" />
                    </svg>
                  )}
                  
                  {step.icon === 'transport' && (
                    <svg className="w-10 h-10 text-cyan-700 transition-all duration-300 group-hover:text-cyan-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path className="transition-all duration-300 group-hover:fill-cyan-700" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path className="transition-all duration-300 group-hover:fill-cyan-700" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6 0a1 1 0 001 1h2a1 1 0 001-1m0 0h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1m-6 0H9" />
                    </svg>
                  )}
                  
                  {step.icon === 'storage' && (
                    <svg className="w-10 h-10 text-yellow-700 transition-all duration-300 group-hover:text-yellow-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path className="transition-all duration-300 group-hover:fill-yellow-700" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )}
                  
                  {step.icon === 'risk' && (
                    <svg className="w-10 h-10 text-red-700 transition-all duration-300 group-hover:text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path className="transition-all duration-300 group-hover:fill-red-700" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  
                  {step.icon === 'loss' && (
                    <svg className="w-10 h-10 text-pink-700 transition-all duration-300 group-hover:text-pink-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path className="transition-all duration-300 group-hover:fill-pink-700" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                </div>

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

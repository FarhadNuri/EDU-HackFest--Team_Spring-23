import { useLanguage } from '../context/LanguageContext'

const WorkflowCard = () => {
  const { language, t } = useLanguage()
  
  const cards = [
    {
      icon: (
        <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" fill="#f0fdf4" stroke="#65a30d" strokeWidth="3"/>
          <circle cx="40" cy="40" r="8" fill="#65a30d"/>
          <path d="M40 20v8M40 52v8M60 40h-8M28 40h-8" stroke="#65a30d" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="40" cy="26" r="3" fill="#84cc16"/>
          <circle cx="40" cy="54" r="3" fill="#84cc16"/>
          <circle cx="54" cy="40" r="3" fill="#84cc16"/>
          <circle cx="26" cy="40" r="3" fill="#84cc16"/>
        </svg>
      ),
      title: 'Data',
      titleBn: 'সেন্সর রিডিং',
      delay: '0s'
    },
    {
      icon: (
        <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
          <path d="M40 12L68 62H12L40 12Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M40 28v16M40 52h.5" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="40" cy="52" r="2" fill="#f59e0b"/>
        </svg>
      ),
      title: 'Warning',
      titleBn: 'সতর্কতা',
      delay: '0.2s'
    },
    {
      icon: (
        <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" fill="#dbeafe" stroke="#3b82f6" strokeWidth="3"/>
          <path d="M28 40h24M48 34l6 6-6 6" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="28" cy="40" r="4" fill="#3b82f6"/>
        </svg>
      ),
      title: 'Action',
      titleBn: 'পদক্ষেপ',
      delay: '0.4s'
    },
    {
      icon: (
        <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
          <rect x="20" y="24" width="40" height="44" rx="3" fill="#dcfce7" stroke="#16a34a" strokeWidth="3"/>
          <rect x="20" y="50" width="40" height="18" fill="#16a34a" opacity="0.7"/>
          <path d="M28 20h24v6H28z" fill="#16a34a"/>
          <path d="M32 32h16M32 40h16M32 58h16" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Saved Food',
      titleBn: 'খাদ্য সংরক্ষিত',
      delay: '0.6s'
    }
  ]

  return (
    <div className="mt-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/70 cursor-pointer animate-fade-in-up"
            style={{ animationDelay: card.delay }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-3">
                {card.icon}
              </div>
              <h4 className={`font-semibold text-gray-900 text-base ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t(card.title, card.titleBn)}
              </h4>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        <p className={`text-sm text-white/90 font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>
          {t(
            'Powered by real-time moisture & weather data',
            'রিয়েল-টাইম আর্দ্রতা ও আবহাওয়া ডেটা দ্বারা চালিত'
          )}
        </p>
      </div>
    </div>
  )
}

export default WorkflowCard

import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage, default to 'bn' (Bangla)
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('appLanguage')
    return savedLanguage || 'bn' // Default to Bangla
  })

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appLanguage', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en')
  }

  const t = (en, bn) => {
    return language === 'en' ? en : bn
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

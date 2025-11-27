import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Homepage from './pages/Homepage'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Set to true to bypass login
  const [showHomepage, setShowHomepage] = useState(false)

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowHomepage(true)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setShowHomepage(false)
  }

  return (
    <LanguageProvider>
      {isLoggedIn && !showHomepage ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Homepage 
          onLoginClick={handleLogin}
          onSignupClick={handleLogin}
        />
      )}
    </LanguageProvider>
  )
}

export default App

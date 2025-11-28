import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Homepage from './pages/Homepage'
import AboutUs from './pages/AboutUs'
import Features from './pages/Features'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import Login from './components/Login'
import Signup from './components/Signup'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Start with login required
  const [currentPage, setCurrentPage] = useState('homepage') // 'dashboard', 'homepage', 'about', 'features', 'contact'
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('homepage')
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
    setShowLogin(false)
  }

  const handleSignupSuccess = () => {
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
    setShowSignup(false)
  }

  const navigateTo = (page) => {
    setCurrentPage(page)
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          {currentPage === 'about' ? (
            <AboutUs onNavigate={navigateTo} />
          ) : currentPage === 'features' ? (
            <Features onNavigate={navigateTo} />
          ) : currentPage === 'contact' ? (
            <Contact onNavigate={navigateTo} />
          ) : isLoggedIn && currentPage === 'dashboard' ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Homepage 
              onLoginClick={() => setShowLogin(true)}
              onSignupClick={() => setShowSignup(true)}
              onNavigate={navigateTo}
            />
          )}
        </div>
        <Footer onNavigate={navigateTo} />
      </div>

      {/* Login Modal */}
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false)
            setShowSignup(true)
          }}
          onLoginSuccess={handleLoginSuccess}
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
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </LanguageProvider>
  )
}

export default App

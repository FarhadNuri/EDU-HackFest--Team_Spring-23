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
import { AuthProvider, useAuthContext } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

function AppContent() {
  const { isAuthenticated, logout } = useAuthContext()
  const [currentPage, setCurrentPage] = useState('homepage')
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  // Check authentication status on mount and redirect to dashboard if logged in
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('dashboard')
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    logout()
    setCurrentPage('homepage')
  }

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard')
    setShowLogin(false)
  }

  const handleSignupSuccess = () => {
    setCurrentPage('dashboard')
    setShowSignup(false)
  }

  const navigateTo = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {isAuthenticated && currentPage === 'dashboard' ? (
          <Dashboard onLogout={handleLogout} />
        ) : currentPage === 'about' ? (
          <AboutUs onNavigate={navigateTo} />
        ) : currentPage === 'features' ? (
          <Features onNavigate={navigateTo} />
        ) : currentPage === 'contact' ? (
          <Contact onNavigate={navigateTo} />
        ) : (
          <Homepage
            onLoginClick={() => setShowLogin(true)}
            onSignupClick={() => setShowSignup(true)}
            onNavigate={navigateTo}
          />
        )}
      </div>
      <Footer onNavigate={navigateTo} />

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
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
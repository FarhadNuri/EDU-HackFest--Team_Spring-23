import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Homepage from './pages/Homepage'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

// Inner App component that uses auth context
function AppContent() {
  const { isAuthenticated, isLoading } = useAuthContext()
  const [showHomepage, setShowHomepage] = useState(false)

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleLoginSuccess = () => {
    setShowHomepage(false)
  }

  return (
    <>
      {isAuthenticated && !showHomepage ? (
        <Dashboard />
      ) : (
        <Homepage 
          onLoginSuccess={handleLoginSuccess}
          onShowDashboard={() => setShowHomepage(false)}
        />
      )}
    </>
  )
}

// Main App component with providers
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App

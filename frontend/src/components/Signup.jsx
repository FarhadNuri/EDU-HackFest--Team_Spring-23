import { useState, useRef, useEffect } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { districtsAPI } from '../services/api'

const Signup = ({ onClose, onSwitchToLogin, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    district: '',
    userType: 'farmer',
    agreeToTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [districtSuggestions, setDistrictSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const districtInputRef = useRef(null)
  const suggestionsRef = useRef(null)

  const { register } = useAuthContext()
  const { showSuccess, showError } = useToast()

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !districtInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const validateForm = () => {
    const errors = {}

    // Name validation
    if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Phone validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }

    // District validation
    if (!formData.district) {
      errors.district = 'Please select your district/upazila'
    }

    // Password validation
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setValidationErrors({})

    // Validate form
    if (!validateForm()) {
      showError('Please fix the errors in the form')
      return
    }

    setIsLoading(true)

    try {
      const result = await register({
        fullname: formData.fullName,
        email: formData.email,
        mobile: formData.phone,
        password: formData.password,
        district: formData.district,
        userType: formData.userType
      })

      if (result.success) {
        showSuccess('Account created successfully! Please login with your credentials.')
        // Delay closing to allow toast to display and switch to login
        setTimeout(() => {
          if (onSwitchToLogin) {
            onSwitchToLogin()
          } else {
            if (onSuccess) onSuccess()
            if (onClose) onClose()
          }
        }, 1500)
      } else {
        setError(result.error || 'Registration failed. Please try again.')
        showError(result.error || 'Registration failed')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Network error. Please check your connection.'
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle district input with search
  const handleDistrictChange = async (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, district: value }))
    
    if (value.length < 2) {
      setDistrictSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    setShowSuggestions(true)

    try {
      const response = await districtsAPI.searchDistricts(value)
      if (response.data.success) {
        setDistrictSuggestions(response.data.districts)
      }
    } catch (error) {
      console.error('Error searching districts:', error)
      setDistrictSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle selecting a suggestion
  const handleSelectDistrict = (district) => {
    setFormData(prev => ({ ...prev, district: district.nameEn }))
    setShowSuggestions(false)
    setDistrictSuggestions([])
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full relative animate-fade-in-up my-4 sm:my-8 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - X Icon */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center transition-all hover:scale-110 z-[100]"
          aria-label="Close"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-4 sm:p-6 md:p-8">

        {/* Logo */}
        <div className="flex items-center justify-center mb-4 sm:mb-6 mt-2">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-lime-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4C10 4.5 10.2 5 10.59 5.41C11 5.81 11.5 6 12 6C12.5 6 13 5.81 13.41 5.41C13.81 5 14 4.5 14 4C14 3.5 13.81 3 13.41 2.59C13 2.19 12.5 2 12 2M12 7C10.9 7 10 7.9 10 9C10 9.79 10.5 10.47 11.21 10.82C9.89 11.46 9 12.86 9 14.5C9 15.14 9.12 15.75 9.34 16.31C8.5 15.5 8 14.3 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 14.3 15.5 15.5 14.66 16.31C14.88 15.75 15 15.14 15 14.5C15 12.86 14.11 11.46 12.79 10.82C13.5 10.47 14 9.79 14 9C14 7.9 13.1 7 12 7M12 11C10.62 11 9.5 12.12 9.5 13.5C9.5 14.88 10.62 16 12 16C13.38 16 14.5 14.88 14.5 13.5C14.5 12.12 13.38 11 12 11M7 14C5.9 14 5 14.9 5 16C5 17.1 5.9 18 7 18C8.1 18 9 17.1 9 16C9 14.9 8.1 14 7 14M17 14C15.9 14 15 14.9 15 16C15 17.1 15.9 18 17 18C18.1 18 19 17.1 19 16C19 14.9 18.1 14 17 14M7 19C5.34 19 4 20.34 4 22H10C10 20.34 8.66 19 7 19M17 19C15.34 19 14 20.34 14 22H20C20 20.34 18.66 19 17 19Z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">Create Account</h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 font-bengali">নতুন অ্যাকাউন্ট তৈরি করুন</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Full Name / পুরো নাম
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent transition ${
                validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="আপনার নাম"
              required
            />
            {validationErrors.fullName && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Email / ইমেইল
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent transition ${
                validationErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              required
            />
            {validationErrors.email && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Phone Number / ফোন নম্বর
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent transition ${
                validationErrors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+880 1XXX-XXXXXX"
              required
            />
            {validationErrors.phone && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.phone}</p>
            )}
          </div>

          {/* District/Upazila with Autocomplete */}
          <div className="relative">
            <label htmlFor="district" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              District/Upazila / জেলা/উপজেলা
            </label>
            <div className="relative">
              <input
                ref={districtInputRef}
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                onFocus={() => formData.district.length >= 2 && setShowSuggestions(true)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent transition ${
                  validationErrors.district ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Start typing... (e.g., Dhaka, Rajshahi)"
                autoComplete="off"
                required
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && districtSuggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {districtSuggestions.map((district, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectDistrict(district)}
                    className="w-full px-4 py-2.5 text-left hover:bg-lime-50 focus:bg-lime-50 focus:outline-none transition flex justify-between items-center border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-sm font-medium text-gray-900">{district.nameEn}</span>
                    <span className="text-sm text-gray-500">{district.nameBn}</span>
                  </button>
                ))}
              </div>
            )}
            
            {showSuggestions && !isSearching && formData.district.length >= 2 && districtSuggestions.length === 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3"
              >
                <p className="text-sm text-gray-500 text-center">No districts found. Try different spelling.</p>
              </div>
            )}
            
            {validationErrors.district && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.district}</p>
            )}
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a / আমি একজন
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition ${
                formData.userType === 'farmer' ? 'border-lime-600 bg-lime-50' : 'border-gray-300 hover:border-lime-400'
              }`}>
                <input
                  type="radio"
                  name="userType"
                  value="farmer"
                  checked={formData.userType === 'farmer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="font-medium">Farmer / কৃষক</span>
              </label>
              <label className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition ${
                formData.userType === 'buyer' ? 'border-lime-600 bg-lime-50' : 'border-gray-300 hover:border-lime-400'
              }`}>
                <input
                  type="radio"
                  name="userType"
                  value="buyer"
                  checked={formData.userType === 'buyer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="font-medium">Buyer / ক্রেতা</span>
              </label>
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password / পাসওয়ার্ড
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent transition ${
                validationErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              required
            />
            {validationErrors.password && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password / পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-transparent transition ${
                validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              required
            />
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="w-4 h-4 mt-1 text-lime-600 border-gray-300 rounded focus:ring-lime-600"
              required
            />
            <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-lime-600 hover:text-lime-700">Terms & Conditions</a>
              {' '}and{' '}
              <a href="#" className="text-lime-600 hover:text-lime-700">Privacy Policy</a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-lime-600 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-lime-700 transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Sign Up / সাইন আপ'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-lime-600 font-semibold hover:text-lime-700"
          >
            Login
          </button>
        </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

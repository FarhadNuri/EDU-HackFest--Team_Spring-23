import { useState, useEffect } from 'react'
import { profileAPI } from '../services/api'
import { useAuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const Profile = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    mobile: '',
    district: '',
    language: 'en'
  })
  const { user } = useAuthContext()
  const { showSuccess, showError } = useToast()

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) return
      
      try {
        setIsLoading(true)
        const response = await profileAPI.getProfile(user._id)
        if (response.data.success) {
          const userData = response.data.user
          setProfileData({
            fullname: userData.fullname || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
            district: userData.district || '',
            language: userData.language || 'en'
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        showError('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user?._id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!user?._id) return

    try {
      setIsLoading(true)
      const response = await profileAPI.updateProfile(user._id, profileData)
      if (response.data.success) {
        showSuccess('Profile updated successfully')
        setIsEditing(false)
      } else {
        showError(response.data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      showError('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full relative animate-fade-in-up my-4 sm:my-8 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center transition-all hover:scale-110 z-50"
          aria-label="Close"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Profile Header */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {profileData.fullname.charAt(0) || 'U'}
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{profileData.fullname || 'User'}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-2">{profileData.email}</p>
                <span className="inline-block px-3 py-1 bg-lime-100 text-lime-700 rounded-full text-xs font-medium">
                  ✓ Verified User
                </span>
              </div>

              {/* Edit Button */}
              <div className="flex justify-end mb-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-sm font-medium">Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Full Name / নাম</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="fullname"
                            value={profileData.fullname}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 font-medium">{profileData.fullname || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Email / ইমেইল</label>
                        <p className="text-sm text-gray-900 font-medium">{profileData.email || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Phone / ফোন</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="mobile"
                            value={profileData.mobile}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 font-medium">{profileData.mobile || 'Not provided'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Upazila / উপজেলা</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="district"
                            value={profileData.district}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 font-medium">{profileData.district || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useAuthContext } from '../context/AuthContext'
import { weatherAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

const Weather = ({ onClose }) => {
  const { language, t } = useLanguage()
  const { user } = useAuthContext()
  const { showError } = useToast()
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const [otherUpazilaSearch, setOtherUpazilaSearch] = useState('')
  const [otherUpazilaWeather, setOtherUpazilaWeather] = useState(null)
  const [otherUpazilaLoading, setOtherUpazilaLoading] = useState(false)
  const [showOtherUpazilaSearch, setShowOtherUpazilaSearch] = useState(false)
  const [filteredUpazilas, setFilteredUpazilas] = useState([])
  const [allUpazilas, setAllUpazilas] = useState([])

  // Save weather data to localStorage
  const saveWeatherToLocalStorage = (data) => {
    try {
      const weatherCache = {
        data: data,
        timestamp: new Date().getTime(),
        district: user?.district
      }
      localStorage.setItem('weatherData', JSON.stringify(weatherCache))
    } catch (error) {
      console.error('Failed to save weather to localStorage:', error)
    }
  }

  // Load weather data from localStorage
  const loadWeatherFromLocalStorage = () => {
    try {
      const cached = localStorage.getItem('weatherData')
      if (!cached) return null

      const weatherCache = JSON.parse(cached)
      const now = new Date().getTime()
      const fourHours = 4 * 60 * 60 * 1000 // 4 hours in milliseconds

      // Check if cache is still valid (less than 4 hours old) and matches user's district
      if (weatherCache.district === user?.district && (now - weatherCache.timestamp) < fourHours) {
        return weatherCache.data
      }
      
      // Cache expired or different district, remove it
      localStorage.removeItem('weatherData')
      return null
    } catch (error) {
      console.error('Failed to load weather from localStorage:', error)
      return null
    }
  }

  // Fetch weather data from backend
  const fetchWeatherData = async () => {
    try {
      setLoading(true)

      // Try to load from localStorage first
      const cachedData = loadWeatherFromLocalStorage()
      if (cachedData) {
        console.log('Weather data loaded from localStorage')
        setWeatherData(cachedData)
        setLoading(false)
        return
      }

      // Fetch from API if no valid cache
      const response = await weatherAPI.getWeather()
      
      if (response.data.success) {
        const apiData = response.data
        
        // Transform API data to component format
        const transformed = {
          location: apiData.location.district,
          current: {
            temp: apiData.forecast[0]?.tempAvg || 0,
            humidity: apiData.forecast[0]?.humidity || 0,
            condition: apiData.forecast[0]?.description || 'Clear',
            conditionBn: translateCondition(apiData.forecast[0]?.description || 'Clear')
          },
          forecast: apiData.forecast.slice(0, 5).map((day, index) => ({
            day: getDayLabel(index),
            dayBn: getDayLabelBn(index),
            temp: day.tempAvg,
            humidity: day.humidity,
            rain: day.rainChance,
            condition: mapConditionToIcon(day.condition)
          }))
        }
        
        setWeatherData(transformed)
        // Save to localStorage for offline access
        saveWeatherToLocalStorage(transformed)
      }
    } catch (error) {
      console.error('Weather fetch error:', error)
      
      // If API fails, try to load any cached data (even if expired)
      const cachedData = loadWeatherFromLocalStorage()
      if (cachedData) {
        console.log('API failed, using expired cache from localStorage')
        setWeatherData(cachedData)
        showError('Using cached weather data (may be outdated)')
      } else {
        showError(error.response?.data?.message || 'Failed to fetch weather data')
      }
    } finally {
      setLoading(false)
    }
  }

  const getDayLabel = (index) => {
    const labels = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5']
    return labels[index] || `Day ${index + 1}`
  }

  const getDayLabelBn = (index) => {
    const labels = ['আজ', 'আগামীকাল', 'পরশু', '৪ দিন', '৫ দিন']
    return labels[index] || `${index + 1} দিন`
  }

  const translateCondition = (condition) => {
    const translations = {
      'clear': 'পরিষ্কার',
      'clouds': 'মেঘলা',
      'rain': 'বৃষ্টি',
      'drizzle': 'গুঁড়ি গুঁড়ি বৃষ্টি',
      'thunderstorm': 'ঝড়',
      'snow': 'তুষারপাত',
      'mist': 'কুয়াশা',
      'clear sky': 'পরিষ্কার আকাশ',
      'few clouds': 'সামান্য মেঘ',
      'scattered clouds': 'ছড়ানো মেঘ',
      'broken clouds': 'মেঘলা',
      'overcast clouds': 'ঘন মেঘ',
      'light rain': 'হালকা বৃষ্টি',
      'moderate rain': 'মাঝারি বৃষ্টি',
      'heavy rain': 'ভারী বৃষ্টি'
    }
    return translations[condition.toLowerCase()] || 'আংশিক মেঘলা'
  }

  const mapConditionToIcon = (condition) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes('clear')) return 'sunny'
    if (lowerCondition.includes('cloud')) return 'cloudy'
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return 'rainy'
    if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) return 'stormy'
    return 'cloudy'
  }

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return (
          <svg className="w-10 h-10 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      case 'cloudy':
        return (
          <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        )
      case 'rainy':
        return (
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 19l-1 2m4-2l-1 2m4-2l-1 2m4-2l-1 2" />
          </svg>
        )
      case 'stormy':
        return (
          <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10l-3 6h4l-3 6" />
          </svg>
        )
      default:
        return (
          <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        )
    }
  }

  useEffect(() => {
    // Fetch weather data when component mounts
    fetchWeatherData()
    // Fetch all upazilas for search
    fetchAllUpazilas()
  }, [])

  const fetchAllUpazilas = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/weather/districts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAllUpazilas(data.districts)
        }
      }
    } catch (error) {
      console.error('Failed to fetch upazilas:', error)
    }
  }

  const fetchOtherUpazilaWeather = async (upazilaName) => {
    try {
      setOtherUpazilaLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/weather?district=${encodeURIComponent(upazilaName)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const apiData = await response.json()
        if (apiData.success) {
          const transformed = {
            location: apiData.location.district,
            current: {
              temp: apiData.forecast[0]?.tempAvg || 0,
              humidity: apiData.forecast[0]?.humidity || 0,
              condition: apiData.forecast[0]?.description || 'Clear',
              conditionBn: translateCondition(apiData.forecast[0]?.description || 'Clear')
            },
            forecast: apiData.forecast.slice(0, 5).map((day, index) => ({
              day: getDayLabel(index),
              dayBn: getDayLabelBn(index),
              temp: day.tempAvg,
              humidity: day.humidity,
              rain: day.rainChance,
              condition: mapConditionToIcon(day.condition)
            }))
          }
          setOtherUpazilaWeather(transformed)
        }
      }
    } catch (error) {
      console.error('Other upazila weather fetch error:', error)
      showError('Failed to fetch weather for selected upazila')
    } finally {
      setOtherUpazilaLoading(false)
    }
  }

  const handleUpazilaSearch = (value) => {
    setOtherUpazilaSearch(value)
    if (value.trim().length > 0) {
      const filtered = allUpazilas.filter(upazila => 
        upazila.nameEn.toLowerCase().includes(value.toLowerCase()) ||
        upazila.nameBn.includes(value)
      ).slice(0, 5)
      setFilteredUpazilas(filtered)
    } else {
      setFilteredUpazilas([])
    }
  }

  const selectOtherUpazila = (upazila) => {
    setOtherUpazilaSearch(language === 'bn' ? upazila.nameBn : upazila.nameEn)
    setFilteredUpazilas([])
    fetchOtherUpazilaWeather(upazila.nameEn)
  }

  // Generate comprehensive advisories based on all weather conditions
  const getAdvisories = () => {
    if (!weatherData || !weatherData.forecast || weatherData.forecast.length === 0) return []

    const allAdvisories = []
    const forecast = weatherData.forecast

    const avgTemp = forecast[0]?.temp || 0
    const avgHumidity = forecast[0]?.humidity || 0
    const todayRain = forecast[0]?.rain || 0
    const tomorrowRain = forecast[1]?.rain || 0
    const day3Rain = forecast[2]?.rain || 0
    const condition = forecast[0]?.condition || ''

    // Calculate multi-day patterns
    const heavyRainDays = forecast.filter(day => day.rain > 70).length
    const moderateRainDays = forecast.filter(day => day.rain >= 40 && day.rain <= 70).length
    const dryDays = forecast.filter(day => day.rain < 20).length
    const hotDays = forecast.filter(day => day.temp > 35).length
    const coldDays = forecast.filter(day => day.temp < 15).length
    const totalRain = forecast.slice(0, 3).reduce((sum, day) => sum + (day?.rain || 0), 0)

    // Priority system: critical > high > medium > low
    // 1. HEAVY RAIN WARNING (Critical - >70%)
    if (heavyRainDays >= 2 || todayRain > 70) {
      allAdvisories.push({
        type: 'warning',
        priority: 1,
        icon: '🌧️',
        titleEn: 'Heavy Rain Warning',
        titleBn: 'ভারী বৃষ্টির সতর্কতা',
        messageEn: `Heavy rain ${todayRain}% for next ${heavyRainDays} days\n• Harvest ready crops immediately\n• Cover stored grains with tarpaulin\n• Move jute bags to higher ground\n• Expect waterlogging in low areas`,
        messageBn: `আগামী ${heavyRainDays} দিন ভারী বৃষ্টি ${todayRain}%\n• প্রস্তুত ফসল এখনই কেটে নিন\n• সংরক্ষিত শস্য ত্রিপল দিয়ে ঢেকে দিন\n• চটের বস্তা উঁচু জায়গায় সরান\n• নিচু এলাকায় জলাবদ্ধতা হতে পারে`,
        color: 'orange'
      })
    }

    // 2. MODERATE RAIN (High Priority 40-70%)
    if (moderateRainDays >= 2 && heavyRainDays < 2) {
      allAdvisories.push({
        type: 'info',
        priority: 2,
        icon: '🌦️',
        titleEn: 'Moderate Rain Expected',
        titleBn: 'মাঝারি বৃষ্টির সম্ভাবনা',
        messageEn: `Moderate rain ${todayRain}% for ${moderateRainDays} days\n• Prepare for harvest if crops are ripe\n• No irrigation needed\n• Monitor for pest and disease`,
        messageBn: `${moderateRainDays} দিন মাঝারি বৃষ্টি ${todayRain}%\n• ফসল পাকলে কাটার প্রস্তুতি নিন\n• সেচের প্রয়োজন নেই\n• কীটপতঙ্গ ও রোগ পর্যবেক্ষণ করুন`,
        color: 'blue'
      })
    }

    // 3. EXTREME HEAT (Critical >35°C)
    if (hotDays > 0 || avgTemp > 35) {
      allAdvisories.push({
        type: 'warning',
        priority: 1,
        icon: '🔥',
        titleEn: 'Extreme Heat Alert',
        titleBn: 'তীব্র গরমের সতর্কতা',
        messageEn: `Extreme heat ${avgTemp}°C\n• Water crops in morning & evening only\n• Mulch soil with straw or plastic\n• Provide shade for sensitive crops\n• Monitor for heat stress`,
        messageBn: `তীব্র গরম ${avgTemp}°C\n• শুধু সকাল ও বিকেলে পানি দিন\n• খড় বা পলিথিন দিয়ে মাটি ঢেকে দিন\n• সংবেদনশীল ফসলে ছায়া দিন\n• তাপ চাপের জন্য পর্যবেক্ষণ করুন`,
        color: 'orange'
      })
    }

    // 4. HIGH TEMPERATURE (Medium 30-35°C)
    if (avgTemp >= 30 && avgTemp <= 35 && hotDays === 0) {
      allAdvisories.push({
        type: 'info',
        priority: 3,
        icon: '🌡️',
        titleEn: 'Warm Weather',
        titleBn: 'উষ্ণ আবহাওয়া',
        messageEn: `Warm ${avgTemp}°C\n• Regular irrigation needed\n• Water between 4-6 PM\n• Maintain soil moisture`,
        messageBn: `উষ্ণ ${avgTemp}°C\n• নিয়মিত সেচ প্রয়োজন\n• বিকেল ৪-৬টায় পানি দিন\n• মাটির আর্দ্রতা বজায় রাখুন`,
        color: 'blue'
      })
    }

    // 5. COLD WEATHER (Medium <15°C)
    if (coldDays >= 2 || avgTemp < 15) {
      allAdvisories.push({
        type: 'info',
        priority: 3,
        icon: '🥶',
        titleEn: 'Cold Weather',
        titleBn: 'ঠান্ডা আবহাওয়া',
        messageEn: `Cold ${avgTemp}°C\n• Protect crops from frost\n• Spray fungicide in morning\n• Fog may cause disease\n• Reduce irrigation`,
        messageBn: `ঠান্ডা ${avgTemp}°C\n• তুষারপাত থেকে ফসল রক্ষা করুন\n• সকালে ছত্রাকনাশক স্প্রে করুন\n• কুয়াশায় রোগ হতে পারে\n• সেচ কমিয়ে দিন`,
        color: 'blue'
      })
    }

    // 6. HIGH HUMIDITY (High >80%)
    if (avgHumidity > 80) {
      allAdvisories.push({
        type: 'caution',
        priority: 2,
        icon: '💧',
        titleEn: 'High Humidity Warning',
        titleBn: 'উচ্চ আর্দ্রতার সতর্কতা',
        messageEn: `High humidity ${avgHumidity}%\n• Risk of fungal diseases\n• Stored crops may develop mold\n• Improve air circulation\n• Apply fungicide spray`,
        messageBn: `উচ্চ আর্দ্রতা ${avgHumidity}%\n• ছত্রাক রোগের ঝুঁকি\n• সংরক্ষিত ফসলে ছাতা পড়তে পারে\n• বায়ু চলাচল বাড়ান\n• ছত্রাকনাশক স্প্রে করুন`,
        color: 'orange'
      })
    }

    // 7. MODERATE HUMIDITY (Medium 60-80%)
    if (avgHumidity >= 60 && avgHumidity <= 80) {
      allAdvisories.push({
        type: 'info',
        priority: 3,
        icon: '💦',
        titleEn: 'Storage Care Needed',
        titleBn: 'সংরক্ষণের যত্ন প্রয়োজন',
        messageEn: `Humidity ${avgHumidity}%\n• Check stored grains daily\n• Ensure proper ventilation\n• Monitor for moisture buildup`,
        messageBn: `আর্দ্রতা ${avgHumidity}%\n• প্রতিদিন সংরক্ষিত শস্য পরীক্ষা করুন\n• সঠিক বায়ুচলাচল নিশ্চিত করুন\n• আর্দ্রতা জমা পর্যবেক্ষণ করুন`,
        color: 'blue'
      })
    }

    // 8. PERFECT DRYING WEATHER (High Priority)
    if (dryDays >= 2 && avgTemp >= 28 && avgTemp <= 35 && avgHumidity < 70 && todayRain < 20) {
      allAdvisories.push({
        type: 'success',
        priority: 2,
        icon: '☀️',
        titleEn: 'Perfect Drying Weather',
        titleBn: 'শুকানোর আদর্শ আবহাওয়া',
        messageEn: `Perfect drying for ${dryDays} days\n• Dry harvested crops now (12-14% moisture)\n• Best time for threshing rice\n• Sun-dry seeds for storage\n• Spread stored grains in sun`,
        messageBn: `${dryDays} দিন শুকানোর আদর্শ আবহাওয়া\n• কাটা ফসল এখনই শুকান (১২-১৪% আর্দ্রতা)\n• ধান মাড়াইয়ের উত্তম সময়\n• বীজ রোদে শুকিয়ে সংরক্ষণ করুন\n• সংরক্ষিত শস্য রোদে মেলে দিন`,
        color: 'green'
      })
    }

    // 9. DRY PERIOD - IRRIGATION NEEDED (Medium)
    if (totalRain < 30 && dryDays >= 3) {
      allAdvisories.push({
        type: 'info',
        priority: 3,
        icon: '💧',
        titleEn: 'Irrigation Planning Required',
        titleBn: 'সেচের পরিকল্পনা প্রয়োজন',
        messageEn: `Low rainfall next 3 days\n• Schedule regular watering\n• Check soil moisture levels\n• Prioritize young plants\n• Consider drip irrigation`,
        messageBn: `আগামী ৩ দিন কম বৃষ্টি\n• নিয়মিত পানি দেওয়ার সময়সূচী করুন\n• মাটির আর্দ্রতা পরীক্ষা করুন\n• নতুন গাছে অগ্রাধিকার দিন\n• ড্রিপ সেচ বিবেচনা করুন`,
        color: 'blue'
      })
    }

    // 10. IDEAL PLANTING CONDITIONS (Low Priority)
    if (todayRain >= 20 && todayRain <= 50 && avgTemp >= 25 && avgTemp <= 32 && avgHumidity >= 60 && avgHumidity <= 80) {
      allAdvisories.push({
        type: 'success',
        priority: 4,
        icon: '🌱',
        titleEn: 'Ideal Planting Weather',
        titleBn: 'চারা রোপণের আদর্শ সময়',
        messageEn: `Perfect for planting\n• Plant new seedlings now\n• Good time for sowing seeds\n• Soil will be moist and soft\n• Can apply fertilizers`,
        messageBn: `রোপণের জন্য উপযুক্ত\n• এখন নতুন চারা রোপণ করুন\n• বীজ বপনের ভালো সময়\n• মাটি আর্দ্র ও নরম থাকবে\n• সার প্রয়োগ করা যাবে`,
        color: 'green'
      })
    }

    // 11. PEST & DISEASE WARNING (High Priority)
    if (avgHumidity >= 70 && avgTemp >= 27) {
      allAdvisories.push({
        type: 'caution',
        priority: 2,
        icon: '🐛',
        titleEn: 'Pest & Disease Alert',
        titleBn: 'কীটপতঙ্গ ও রোগের সতর্কতা',
        messageEn: `Hot & humid conditions\n• High risk of pest infestation\n• Inspect crops regularly\n• Take preventive measures\n• Apply organic pesticides`,
        messageBn: `গরম ও আর্দ্র পরিস্থিতি\n• কীটপতঙ্গের আক্রমণের ঝুঁকি বেশি\n• নিয়মিত ফসল পরিদর্শন করুন\n• প্রতিরোধমূলক ব্যবস্থা নিন\n• জৈব কীটনাশক প্রয়োগ করুন`,
        color: 'orange'
      })
    }

    // 12. HARVESTING WINDOW (Medium Priority)
    if (dryDays >= 2 && day3Rain < 30) {
      allAdvisories.push({
        type: 'success',
        priority: 3,
        icon: '🌾',
        titleEn: 'Good Harvesting Window',
        titleBn: 'ফসল কাটার সুযোগ',
        messageEn: `Next 3 days good for harvest\n• Plan crop collection now\n• Dry conditions favorable\n• Complete before rain returns`,
        messageBn: `আগামী ৩ দিন ফসল কাটার জন্য ভালো\n• এখনই ফসল সংগ্রহের পরিকল্পনা করুন\n• শুকনো অবস্থা অনুকূল\n• বৃষ্টি ফেরার আগে শেষ করুন`,
        color: 'green'
      })
    }

    // 13. RAIN TOMORROW (High Priority)
    if (tomorrowRain > 50) {
      allAdvisories.push({
        type: 'warning',
        priority: 2,
        icon: '🌧️',
        titleEn: 'Rain Expected Tomorrow',
        titleBn: 'আগামীকাল বৃষ্টি প্রত্যাশিত',
        messageEn: `${tomorrowRain}% rain chance tomorrow\n• Complete harvesting today\n• Secure loose equipment\n• Cover exposed materials\n• Prepare drainage systems`,
        messageBn: `আগামীকাল ${tomorrowRain}% বৃষ্টির সম্ভাবনা\n• আজই ফসল কাটা শেষ করুন\n• আলগা সরঞ্জাম সুরক্ষিত করুন\n• খোলা মালপত্র ঢেকে দিন\n• নিষ্কাশন ব্যবস্থা প্রস্তুত করুন`,
        color: 'orange'
      })
    }

    // 14. FOGGY CONDITIONS (Medium Priority)
    if (avgTemp < 18 && avgHumidity > 85) {
      allAdvisories.push({
        type: 'info',
        priority: 3,
        icon: '🌫️',
        titleEn: 'Foggy Conditions Expected',
        titleBn: 'কুয়াশার সম্ভাবনা',
        messageEn: `Fog likely\n• High risk of blast disease\n• Spray fungicide in morning\n• Shake water off leaves\n• Improve air circulation`,
        messageBn: `কুয়াশার সম্ভাবনা\n• ব্লাস্ট রোগের ঝুঁকি বেশি\n• সকালে ছত্রাকনাশক স্প্রে করুন\n• পাতা থেকে পানি ঝরিয়ে দিন\n• বায়ু চলাচল বাড়ান`,
        color: 'blue'
      })
    }

    // 15. WINDY CONDITIONS (Medium Priority)
    if (condition.toLowerCase().includes('wind')) {
      allAdvisories.push({
        type: 'info',
        priority: 3,
        icon: '💨',
        titleEn: 'Windy Conditions',
        titleBn: 'বাতাসের পরিস্থিতি',
        messageEn: `Strong winds expected\n• Secure crops firmly\n• Support tall plants with stakes\n• Protect seedlings and young plants\n• Avoid pesticide spraying`,
        messageBn: `প্রবল বাতাসের সম্ভাবনা\n• ফসল ভালোভাবে বেঁধে দিন\n• লম্বা গাছে খুঁটি দিয়ে সাপোর্ট দিন\n• চারা ও নতুন গাছ রক্ষা করুন\n• কীটনাশক স্প্রে এড়িয়ে চলুন`,
        color: 'blue'
      })
    }

    // 16. CLOUDY/OVERCAST (Low Priority)
    if (condition.toLowerCase().includes('cloud') && todayRain < 40) {
      allAdvisories.push({
        type: 'info',
        priority: 4,
        icon: '☁️',
        titleEn: 'Cloudy Weather',
        titleBn: 'মেঘলা আবহাওয়া',
        messageEn: `Cloudy conditions\n• Reduced sunlight for crops\n• Good for transplanting seedlings\n• Monitor for disease development\n• Light irrigation may be needed`,
        messageBn: `মেঘলা পরিস্থিতি\n• ফসলের জন্য সূর্যালোক কম\n• চারা রোপণের জন্য ভালো\n• রোগের বিকাশ পর্যবেক্ষণ করুন\n• হালকা সেচের প্রয়োজন হতে পারে`,
        color: 'blue'
      })
    }

    // 17. LIGHT RAIN (Low Priority)
    if (todayRain >= 20 && todayRain < 40) {
      allAdvisories.push({
        type: 'success',
        priority: 4,
        icon: '🌦️',
        titleEn: 'Light Rain Expected',
        titleBn: 'হালকা বৃষ্টির সম্ভাবনা',
        messageEn: `Light rain ${todayRain}%\n• Natural irrigation beneficial\n• Good for crop growth\n• Reduce manual watering\n• Good time for fertilizer application`,
        messageBn: `হালকা বৃষ্টি ${todayRain}%\n• প্রাকৃতিক সেচ উপকারী\n• ফসল বৃদ্ধির জন্য ভালো\n• হাতে পানি দেওয়া কমান\n• সার প্রয়োগের ভালো সময়`,
        color: 'green'
      })
    }

    // 18. OPTIMAL TEMPERATURE (Low Priority)
    if (avgTemp >= 20 && avgTemp < 30 && avgHumidity < 70) {
      allAdvisories.push({
        type: 'success',
        priority: 4,
        icon: '🌡️',
        titleEn: 'Optimal Temperature',
        titleBn: 'সর্বোত্তম তাপমাত্রা',
        messageEn: `Perfect ${avgTemp}°C\n• Ideal for most crops\n• Maximum photosynthesis\n• Good growth conditions\n• Continue regular care`,
        messageBn: `নিখুঁত ${avgTemp}°C\n• বেশিরভাগ ফসলের জন্য আদর্শ\n• সর্বোচ্চ সালোকসংশ্লেষণ\n• ভালো বৃদ্ধির অবস্থা\n• নিয়মিত যত্ন চালিয়ে যান`,
        color: 'green'
      })
    }

    // 19. LOW HUMIDITY (Low Priority)
    if (avgHumidity < 40) {
      allAdvisories.push({
        type: 'info',
        priority: 4,
        icon: '💨',
        titleEn: 'Low Humidity',
        titleBn: 'কম আর্দ্রতা',
        messageEn: `Low humidity ${avgHumidity}%\n• Increase watering frequency\n• Monitor for water stress\n• Mulch to retain moisture\n• Good for storage activities`,
        messageBn: `কম আর্দ্রতা ${avgHumidity}%\n• পানি দেওয়ার পরিমাণ বাড়ান\n• পানির চাপ পর্যবেক্ষণ করুন\n• আর্দ্রতা ধরে রাখতে মালচ করুন\n• সংরক্ষণ কাজের জন্য ভালো`,
        color: 'blue'
      })
    }

    // 20. THUNDERSTORM WARNING (Critical)
    if (condition.toLowerCase().includes('thunder') || condition.toLowerCase().includes('storm')) {
      allAdvisories.push({
        type: 'warning',
        priority: 1,
        icon: '⛈️',
        titleEn: 'Thunderstorm Warning',
        titleBn: 'বজ্রঝড়ের সতর্কতা',
        messageEn: `Severe thunderstorm risk\n• Move to safe shelter immediately\n• Secure all equipment and tools\n• Protect crops with covers\n• Stay away from trees and metal`,
        messageBn: `তীব্র বজ্রঝড়ের ঝুঁকি\n• অবিলম্বে নিরাপদ আশ্রয়ে যান\n• সব সরঞ্জাম ও যন্ত্র সুরক্ষিত করুন\n• ফসল ঢেকে দিয়ে রক্ষা করুন\n• গাছ ও ধাতু থেকে দূরে থাকুন`,
        color: 'orange'
      })
    }

    // 21. GENERAL GOOD WEATHER (Low Priority)
    if (todayRain < 20 && avgTemp >= 22 && avgTemp <= 30 && avgHumidity >= 40 && avgHumidity < 70) {
      allAdvisories.push({
        type: 'success',
        priority: 4,
        icon: '✅',
        titleEn: 'Favorable Conditions',
        titleBn: 'অনুকূল পরিস্থিতি',
        messageEn: `Good weather conditions\n• Continue normal farm activities\n• Regular crop maintenance\n• Clear weeds and inspect fields\n• Apply scheduled fertilizers`,
        messageBn: `ভালো আবহাওয়া\n• স্বাভাবিক কৃষিকাজ চালিয়ে যান\n• নিয়মিত ফসলের যত্ন নিন\n• আগাছা পরিষ্কার ও জমি পরিদর্শন\n• নির্ধারিত সার প্রয়োগ করুন`,
        color: 'green'
      })
    }

    // 22. CURRENT WEATHER SUMMARY (Always show - Priority 4)
    allAdvisories.push({
      type: 'info',
      priority: 4,
      icon: '📊',
      titleEn: 'Today\'s Weather Summary',
      titleBn: 'আজকের আবহাওয়ার সারসংক্ষেপ',
      messageEn: `Temperature: ${avgTemp}°C\nHumidity: ${avgHumidity}%\nRain chance: ${todayRain}%\nCondition: ${weatherData.current.condition}`,
      messageBn: `তাপমাত্রা: ${avgTemp}°C\nআর্দ্রতা: ${avgHumidity}%\nবৃষ্টির সম্ভাবনা: ${todayRain}%\nঅবস্থা: ${weatherData.current.conditionBn}`,
      color: 'blue'
    })

    // Sort by priority and ensure at least 4-6 advisories
    const sortedAdvisories = allAdvisories.sort((a, b) => a.priority - b.priority)
    
    // Return 4-6 advisories based on availability
    if (sortedAdvisories.length <= 4) {
      return sortedAdvisories
    } else if (sortedAdvisories.length <= 6) {
      return sortedAdvisories
    } else {
      return sortedAdvisories.slice(0, 6)
    }
  }

  const advisories = getAdvisories()

  const getColorClasses = (color) => {
    const colors = {
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      red: 'bg-red-50 border-red-200 text-red-900',
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900'
    }
    return colors[color] || colors.blue
  }

  const toBengaliNumber = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
    return String(num).split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('')
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full relative animate-fade-in-up my-4 sm:my-8 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
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
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {t('Weather Forecast', 'আবহাওয়ার পূর্বাভাস')}
            </h2>
            <p className={`text-sm sm:text-base text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
              {language === 'bn' ? `আপনার উপজেলার আবহাওয়া: ${user?.district || 'ঢাকা'}` : `Weather for your Upazila: ${user?.district || 'Dhaka'}`}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-4 text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                {t('Loading weather data...', 'আবহাওয়ার তথ্য লোড হচ্ছে...')}
              </p>
            </div>
          ) : weatherData && (
            <>
              {/* Current Weather */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-lg mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {weatherData.location}
                    </p>
                    <p className={`text-5xl font-bold ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? toBengaliNumber(weatherData.current.temp) : weatherData.current.temp}°C
                    </p>
                    <p className={`text-blue-100 mt-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? weatherData.current.conditionBn : weatherData.current.condition}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div className="flex items-center justify-end space-x-1">
                      <svg className="w-4 h-4 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.5 2a.5.5 0 01.5.5V3h8v-.5a.5.5 0 011 0V3h1.5A1.5 1.5 0 0118 4.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5v-11A1.5 1.5 0 013.5 3H5v-.5a.5.5 0 01.5-.5zM3 6v9.5a.5.5 0 00.5.5h13a.5.5 0 00.5-.5V6H3z" clipRule="evenodd" />
                      </svg>
                      <p className={`text-sm text-blue-100 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {t('Humidity', 'আর্দ্রতা')}: {language === 'bn' ? toBengaliNumber(weatherData.current.humidity) : weatherData.current.humidity}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="mb-6">
                <h3 className={`text-lg font-bold text-gray-900 mb-4 ${language === 'bn' ? 'font-bengali' : ''}`}>
                  {t('5-Day Forecast', '৫ দিনের পূর্বাভাস')}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {weatherData.forecast.map((day, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedDay(selectedDay === index ? null : index)}
                      className={`bg-gray-50 rounded-lg p-4 text-center transition cursor-pointer ${
                        selectedDay === index ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className={`text-sm font-medium text-gray-700 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? day.dayBn : day.day}
                      </p>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className={`text-xl font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? toBengaliNumber(day.temp) : day.temp}°C
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-center space-x-1">
                          <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.5 2a.5.5 0 01.5.5V3h8v-.5a.5.5 0 011 0V3h1.5A1.5 1.5 0 0118 4.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5v-11A1.5 1.5 0 013.5 3H5v-.5a.5.5 0 01.5-.5zM3 6v9.5a.5.5 0 00.5.5h13a.5.5 0 00.5-.5V6H3z" clipRule="evenodd" />
                          </svg>
                          <p className={`text-xs text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {language === 'bn' ? toBengaliNumber(day.humidity) : day.humidity}%
                          </p>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                          <svg className={`w-3 h-3 ${day.rain >= 70 ? 'text-orange-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          </svg>
                          <p className={`text-xs font-semibold ${day.rain >= 70 ? 'text-orange-600' : 'text-blue-600'} ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {language === 'bn' ? toBengaliNumber(day.rain) : day.rain}%
                          </p>
                        </div>
                      </div>
                      {selectedDay === index && (
                        <p className={`text-xs text-blue-600 mt-2 font-semibold ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {t('View Details ↓', 'বিস্তারিত দেখুন ↓')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Day View */}
              {selectedDay !== null && (
                <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? weatherData.forecast[selectedDay].dayBn : weatherData.forecast[selectedDay].day} - {t('Detailed Weather', 'বিস্তারিত আবহাওয়া')}
                    </h3>
                    <button
                      onClick={() => setSelectedDay(null)}
                      className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-white/50 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Temperature */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        </svg>
                        <h4 className={`font-semibold text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {t('Temperature', 'তাপমাত্রা')}
                        </h4>
                      </div>
                      <p className={`text-3xl font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? toBengaliNumber(weatherData.forecast[selectedDay].temp) : weatherData.forecast[selectedDay].temp}°C
                      </p>
                      <p className={`text-sm text-gray-600 mt-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {weatherData.forecast[selectedDay].temp > 35 ? t('Very Hot', 'খুব গরম') :
                         weatherData.forecast[selectedDay].temp > 30 ? t('Hot', 'গরম') :
                         weatherData.forecast[selectedDay].temp > 25 ? t('Warm', 'উষ্ণ') :
                         weatherData.forecast[selectedDay].temp > 20 ? t('Pleasant', 'মনোরম') :
                         weatherData.forecast[selectedDay].temp > 15 ? t('Cool', 'শীতল') :
                         t('Cold', 'ঠান্ডা')}
                      </p>
                    </div>

                    {/* Humidity */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.5 2a.5.5 0 01.5.5V3h8v-.5a.5.5 0 011 0V3h1.5A1.5 1.5 0 0118 4.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5v-11A1.5 1.5 0 013.5 3H5v-.5a.5.5 0 01.5-.5z" clipRule="evenodd" />
                        </svg>
                        <h4 className={`font-semibold text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {t('Humidity', 'আর্দ্রতা')}
                        </h4>
                      </div>
                      <p className={`text-3xl font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? toBengaliNumber(weatherData.forecast[selectedDay].humidity) : weatherData.forecast[selectedDay].humidity}%
                      </p>
                      <p className={`text-sm text-gray-600 mt-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {weatherData.forecast[selectedDay].humidity > 80 ? t('Very High', 'খুব বেশি') :
                         weatherData.forecast[selectedDay].humidity > 60 ? t('High', 'বেশি') :
                         weatherData.forecast[selectedDay].humidity > 40 ? t('Moderate', 'মাঝারি') :
                         t('Low', 'কম')}
                      </p>
                    </div>

                    {/* Rain Chance */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                        <h4 className={`font-semibold text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {t('Rain Chance', 'বৃষ্টির সম্ভাবনা')}
                        </h4>
                      </div>
                      <p className={`text-3xl font-bold ${weatherData.forecast[selectedDay].rain > 70 ? 'text-orange-600' : 'text-gray-900'} ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? toBengaliNumber(weatherData.forecast[selectedDay].rain) : weatherData.forecast[selectedDay].rain}%
                      </p>
                      <p className={`text-sm text-gray-600 mt-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {weatherData.forecast[selectedDay].rain > 70 ? t('Heavy Rain', 'ভারী বৃষ্টি') :
                         weatherData.forecast[selectedDay].rain > 40 ? t('Moderate Rain', 'মাঝারি বৃষ্টি') :
                         weatherData.forecast[selectedDay].rain > 20 ? t('Light Rain', 'হালকা বৃষ্টি') :
                         t('No Rain', 'বৃষ্টি নেই')}
                      </p>
                    </div>

                    {/* Condition */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        {getWeatherIcon(weatherData.forecast[selectedDay].condition)}
                        <h4 className={`font-semibold text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                          {t('Condition', 'অবস্থা')}
                        </h4>
                      </div>
                      <p className={`text-lg font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {language === 'bn' ? weatherData.current.conditionBn : weatherData.current.condition}
                      </p>
                      <p className={`text-sm text-gray-600 mt-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {weatherData.forecast[selectedDay].condition === 'sunny' ? t('Clear sky', 'পরিষ্কার আকাশ') :
                         weatherData.forecast[selectedDay].condition === 'cloudy' ? t('Overcast', 'মেঘলা') :
                         weatherData.forecast[selectedDay].condition === 'rainy' ? t('Rainy', 'বৃষ্টি') :
                         t('Variable', 'পরিবর্তনশীল')}
                      </p>
                    </div>
                  </div>

                  {/* Farming Recommendations */}
                  <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
                    <h4 className={`font-semibold text-gray-900 mb-3 flex items-center space-x-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      <span className="text-xl">🌾</span>
                      <span>{t('Farming Recommendations', 'কৃষি সুপারিশ')}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {weatherData.forecast[selectedDay].rain > 70 && (
                        <div className="flex items-start space-x-2 text-sm">
                          <span className="text-orange-500 mt-0.5">⚠️</span>
                          <p className={`text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Avoid harvesting - heavy rain expected', 'ফসল কাটা এড়িয়ে চলুন - ভারী বৃষ্টির সম্ভাবনা')}
                          </p>
                        </div>
                      )}
                      {weatherData.forecast[selectedDay].temp > 35 && (
                        <div className="flex items-start space-x-2 text-sm">
                          <span className="text-red-500 mt-0.5">🔥</span>
                          <p className={`text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Increase irrigation - extreme heat', 'সেচ বাড়ান - তীব্র গরম')}
                          </p>
                        </div>
                      )}
                      {weatherData.forecast[selectedDay].humidity > 80 && (
                        <div className="flex items-start space-x-2 text-sm">
                          <span className="text-blue-500 mt-0.5">💧</span>
                          <p className={`text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Check for fungal diseases - high humidity', 'ছত্রাক রোগ পরীক্ষা করুন - উচ্চ আর্দ্রতা')}
                          </p>
                        </div>
                      )}
                      {weatherData.forecast[selectedDay].rain < 20 && weatherData.forecast[selectedDay].temp < 35 && (
                        <div className="flex items-start space-x-2 text-sm">
                          <span className="text-green-500 mt-0.5">✅</span>
                          <p className={`text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Good day for outdoor farm work', 'বাইরের কৃষিকাজের জন্য ভালো দিন')}
                          </p>
                        </div>
                      )}
                      {weatherData.forecast[selectedDay].rain >= 20 && weatherData.forecast[selectedDay].rain <= 40 && (
                        <div className="flex items-start space-x-2 text-sm">
                          <span className="text-green-500 mt-0.5">🌱</span>
                          <p className={`text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Ideal for planting - light rain expected', 'রোপণের জন্য আদর্শ - হালকা বৃষ্টির সম্ভাবনা')}
                          </p>
                        </div>
                      )}
                      {weatherData.forecast[selectedDay].temp >= 20 && weatherData.forecast[selectedDay].temp <= 30 && weatherData.forecast[selectedDay].rain < 20 && (
                        <div className="flex items-start space-x-2 text-sm">
                          <span className="text-yellow-500 mt-0.5">☀️</span>
                          <p className={`text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Perfect for drying harvested crops', 'কাটা ফসল শুকানোর জন্য নিখুঁত')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Advisories */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold text-gray-900 ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {t('Weather Advisories', 'আবহাওয়া পরামর্শ')}
                  </h3>
                  {advisories.length > 0 && (
                    <span className={`text-sm font-semibold text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                      {language === 'bn' ? `মোট ${toBengaliNumber(advisories.length)} টি` : `Total ${advisories.length}`}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {advisories.length > 0 ? advisories.map((advisory, index) => (
                    <div 
                      key={index}
                      className={`${getColorClasses(advisory.color)} border-2 rounded-xl p-4 transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 pt-0.5">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                            ${advisory.color === 'orange' ? 'bg-orange-200' : 
                              advisory.color === 'blue' ? 'bg-blue-200' : 
                              advisory.color === 'green' ? 'bg-green-200' : 'bg-gray-200'}`}>
                            {advisory.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-base mb-1.5 leading-tight ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {language === 'bn' ? advisory.titleBn : advisory.titleEn}
                          </h4>
                          <p className={`text-sm leading-relaxed whitespace-pre-line text-gray-700 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {language === 'bn' ? advisory.messageBn : advisory.messageEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className={language === 'bn' ? 'font-bengali' : ''}>
                        {t('No advisories available', 'কোন পরামর্শ উপলব্ধ নেই')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Info Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                  <p className={`text-xs text-gray-500 text-center ${language === 'bn' ? 'font-bengali' : ''}`}>
                    {t(
                      'Powered by OpenWeatherMap • Updated every hour',
                      'OpenWeatherMap দ্বারা চালিত • প্রতি ঘন্টায় আপডেট'
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Weather

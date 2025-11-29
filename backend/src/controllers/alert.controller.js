import Crop from "../models/crop.model.js"
import User from "../models/auth.model.js"
import { generateMockSensorData, calculateETCL, getWeatherForPrediction } from "../lib/prediction.lib.js"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyB5bEFwsdzeqaNG2KKXiTvhqrnika1UW44")

/**
 * Generate smart alerts for all farmer's crops
 */
export async function generateSmartAlerts(req, res) {
    try {
        console.log('\n🔔 Smart Alerts Request Started')
        console.log('User ID:', req.user?.userId)
        
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ success: false, message: "User not logged in" })
        }

        // Get full user data
        const user = await User.findById(req.user.userId)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        
        console.log('User Name:', user.fullname)

        // Get farmer's crops
        const crops = await Crop.find({ farmerId: req.user.userId })
        console.log(`Found ${crops.length} crops for farmer`)

        if (crops.length === 0) {
            console.log('⚠️  No crops registered - returning empty alerts')
            return res.json({
                success: true,
                alerts: [],
                message: "No crops registered"
            })
        }

        // Get weather data
        console.log('Fetching weather data...')
        const weatherData = await getWeatherDataForUser(user)
        console.log('Weather data:', weatherData.current ? 'Available' : 'Not available')

        // Generate alerts for each crop
        const alerts = []
        
        console.log(`\nProcessing ${crops.length} crops...`)
        for (let i = 0; i < crops.length; i++) {
            const crop = crops[i]
            console.log(`\n[${i + 1}/${crops.length}] Processing crop: ${crop.cropType}`)
            
            try {
                // Get risk prediction using the same logic as prediction controller
                console.log('  - Getting risk prediction...')
                const prediction = await getCropRiskPrediction(crop, user)
                console.log(`  - Risk Level: ${prediction.riskLevel} (Score: ${prediction.riskScore})`)

                // Generate alert for all risk levels (for testing)
                // TODO: Change back to only Critical/High for production
                if (prediction.riskLevel) {
                    console.log('  - Generating alert with Gemini...')
                    const alert = await generateAlertWithGemini(crop, weatherData, prediction)
                    console.log('  - ✅ Alert generated successfully')
                    
                    alerts.push({
                        cropId: crop._id,
                        cropType: crop.cropType,
                        riskLevel: prediction.riskLevel,
                        message: alert,
                        timestamp: new Date()
                    })

                    // Log to console for SMS simulation
                    console.log('\n🚨 CRITICAL ALERT - SMS SIMULATION 🚨')
                    console.log('═══════════════════════════════════════')
                    console.log(`Farmer: ${user.fullname}`)
                    console.log(`Phone: ${user.phone || 'N/A'}`)
                    console.log(`Crop: ${crop.cropType}`)
                    console.log(`Risk Level: ${prediction.riskLevel}`)
                    console.log(`Message: ${alert}`)
                    console.log('═══════════════════════════════════════\n')
                } else {
                    console.log(`  - ⏭️  Skipping (Risk: ${prediction.riskLevel})`)
                }
            } catch (error) {
                console.error(`  - ❌ Error generating alert for crop ${crop._id}:`, error.message)
                console.error('  - Stack:', error.stack)
            }
        }
        
        console.log(`\n✅ Generated ${alerts.length} alerts total`)

        res.json({
            success: true,
            alerts: alerts,
            count: alerts.length
        })
    } catch (error) {
        console.error("Error generating smart alerts:", error)
        res.status(500).json({ success: false, message: "Failed to generate alerts" })
    }
}

/**
 * Generate a single alert for a specific crop
 */
export async function generateCropAlert(req, res) {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ success: false, message: "User not logged in" })
        }

        // Get full user data
        const user = await User.findById(req.user.userId)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const { cropId } = req.params

        // Get crop
        const crop = await Crop.findOne({ _id: cropId, farmerId: req.user.userId })
        
        if (!crop) {
            return res.status(404).json({ success: false, message: "Crop not found" })
        }

        // Get weather data
        const weatherData = await getWeatherDataForUser(user)

        // Get risk prediction using the same logic as prediction controller
        const prediction = await getCropRiskPrediction(crop, user)

        // Generate alert with Gemini
        const alert = await generateAlertWithGemini(crop, weatherData, prediction)

        // Log to console for SMS simulation
        if (prediction.riskLevel === 'Critical') {
            console.log('\n🚨 CRITICAL ALERT - SMS SIMULATION 🚨')
            console.log('═══════════════════════════════════════')
            console.log(`Farmer: ${user.fullname}`)
            console.log(`Phone: ${user.phone || 'N/A'}`)
            console.log(`Crop: ${crop.cropType}`)
            console.log(`Risk Level: ${prediction.riskLevel}`)
            console.log(`Message: ${alert}`)
            console.log('═══════════════════════════════════════\n')
        }

        res.json({
            success: true,
            alert: {
                cropId: crop._id,
                cropType: crop.cropType,
                riskLevel: prediction.riskLevel,
                message: alert,
                timestamp: new Date()
            }
        })
    } catch (error) {
        console.error("Error generating crop alert:", error)
        res.status(500).json({ success: false, message: "Failed to generate alert" })
    }
}

/**
 * Generate alert message using Gemini AI
 */
async function generateAlertWithGemini(crop, weatherData, prediction) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

        // Get current conditions from prediction
        const temp = prediction.currentConditions?.temperature || 25
        const humidity = prediction.currentConditions?.humidity || 70
        const moisture = prediction.currentConditions?.moisture || 15
        
        // Calculate storage duration
        const storageDays = Math.floor((Date.now() - new Date(crop.harvestDate).getTime()) / (1000 * 60 * 60 * 24))
        
        // Log data being sent to Gemini
        console.log('\n📊 Data being sent to Gemini:')
        console.log('Crop:', crop.cropType, '|', crop.weight, 'kg')
        console.log('Storage:', crop.storageType, '|', storageDays, 'days')
        console.log('Current Conditions:', `${temp.toFixed(1)}°C`, `${humidity.toFixed(1)}%`)
        console.log('Weather Today:', weatherData.current?.temp, '°C', weatherData.current?.description)
        console.log('Weather Tomorrow:', weatherData.tomorrow?.temp, '°C', weatherData.tomorrow?.description)
        console.log('Risk:', prediction.riskLevel, '|', prediction.riskScore, '/100')
        console.log('Issues:', prediction.issues?.join(', ') || 'None')
        
        // Prepare context for Gemini
        const prompt = `
আপনি একজন কৃষি বিশেষজ্ঞ। নিচের তথ্যের উপর ভিত্তি করে একটি সংক্ষিপ্ত, সুনির্দিষ্ট এবং কার্যকর পরামর্শ বাংলায় দিন।

ফসলের তথ্য:
- ফসলের ধরন: ${crop.cropType}
- ওজন: ${crop.weight} কেজি
- সংরক্ষণের ধরন: ${crop.storageType}
- সংরক্ষণের স্থান: ${crop.storageLocation}
- বর্তমান তাপমাত্রা: ${temp.toFixed(1)}°C
- বর্তমান আর্দ্রতা: ${humidity.toFixed(1)}%
- আর্দ্রতা সামগ্রী: ${moisture.toFixed(1)}%
- সংরক্ষণের সময়কাল: ${storageDays} দিন
- ফসল তোলার তারিখ: ${new Date(crop.harvestDate).toLocaleDateString('bn-BD')}

আবহাওয়ার পূর্বাভাস:
- আজকের তাপমাত্রা: ${weatherData.current?.temp || temp}°C
- আজকের আর্দ্রতা: ${weatherData.current?.humidity || humidity}%
- আজকের আবহাওয়া: ${weatherData.current?.description || 'তথ্য নেই'}
- আগামীকালের আবহাওয়া: ${weatherData.tomorrow?.description || 'তথ্য নেই'}
- আগামীকালের তাপমাত্রা: ${weatherData.tomorrow?.temp || temp}°C
- আগামীকালের আর্দ্রতা: ${weatherData.tomorrow?.humidity || humidity}%

ঝুঁকি বিশ্লেষণ:
- ঝুঁকির মাত্রা: ${prediction.riskLevel}
- ঝুঁকি স্কোর: ${prediction.riskScore}/100
- সমস্যা: ${prediction.issues?.join(', ') || 'কোন নির্দিষ্ট সমস্যা চিহ্নিত হয়নি'}

নির্দেশনা:
1. ২-৩ বাক্যে সংক্ষিপ্ত পরামর্শ দিন
2. সুনির্দিষ্ট পদক্ষেপ উল্লেখ করুন (যেমন: ফ্যান চালু করুন, জানালা খুলুন, ইত্যাদি)
3. ঝুঁকির মাত্রা অনুযায়ী ভাষা ব্যবহার করুন:
   - Critical/High: "এখনই" বা "অবিলম্বে"
   - Medium: "শীঘ্রই" বা "যত তাড়াতাড়ি সম্ভব"
   - Low: "নিয়মিত" বা "সতর্কতার সাথে"
4. শুধুমাত্র বাংলায় উত্তর দিন
5. আবহাওয়ার পূর্বাভাস উল্লেখ করুন যদি প্রাসঙ্গিক হয়

উদাহরণ (ভালো পরামর্শ):
- Critical: "আগামীকাল বৃষ্টি হবে এবং আপনার আলু গুদামে আর্দ্রতা বেশি। এখনই ফ্যান চালু করুন এবং জানালা খুলে বাতাস চলাচল বাড়ান।"
- Medium: "আপনার ধান গুদামে তাপমাত্রা কিছুটা বেশি। শীঘ্রই বায়ুচলাচল বাড়ান এবং নিয়মিত পরীক্ষা করুন।"
- Low: "আপনার ফসল ভালো অবস্থায় আছে। বর্তমান সংরক্ষণ পদ্ধতি চালিয়ে যান এবং নিয়মিত পর্যবেক্ষণ করুন।"

এখন উপরের তথ্যের উপর ভিত্তি করে পরামর্শ দিন:
`

        console.log('  - Sending prompt to Gemini...')
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        
        console.log('  - ✅ Gemini response received:', text.substring(0, 100) + '...')
        return text.trim()
    } catch (error) {
        console.error("  - ❌ Error calling Gemini API:", error.message)
        console.error("  - Using fallback alert instead")
        
        // Fallback to template-based alert
        return generateFallbackAlert(crop, weatherData, prediction)
    }
}

/**
 * Fallback alert generation if Gemini fails
 */
function generateFallbackAlert(crop, weatherData, prediction) {
    const alerts = []
    
    // Get current conditions from prediction
    const temp = prediction.currentConditions?.temperature || 25
    const humidity = prediction.currentConditions?.humidity || 70

    // Temperature alerts
    if (temp > 25) {
        alerts.push(`আপনার ${crop.cropType} গুদামে তাপমাত্রা অত্যধিক (${temp.toFixed(1)}°C)। অবিলম্বে ঠান্ডা করার ব্যবস্থা করুন।`)
    } else if (temp < 10) {
        alerts.push(`আপনার ${crop.cropType} গুদামে তাপমাত্রা খুব কম (${temp.toFixed(1)}°C)। উষ্ণতা বাড়ান।`)
    }

    // Humidity alerts
    if (humidity > 80) {
        alerts.push(`আর্দ্রতা অত্যধিক (${humidity.toFixed(1)}%)। এখনই ফ্যান চালু করুন এবং বাতাস চলাচল বাড়ান।`)
    } else if (humidity < 50) {
        alerts.push(`আর্দ্রতা খুব কম (${humidity.toFixed(1)}%)। পানি ছিটিয়ে আর্দ্রতা বাড়ান।`)
    }

    // Weather-based alerts
    if (weatherData.tomorrow?.description?.includes('rain') || weatherData.tomorrow?.description?.includes('বৃষ্টি')) {
        alerts.push(`আগামীকাল বৃষ্টির সম্ভাবনা। গুদাম ভালোভাবে বন্ধ রাখুন।`)
    }
    
    // Risk-based alerts
    if (prediction.riskLevel === 'Critical') {
        alerts.push(`ঝুঁকির মাত্রা অত্যন্ত উচ্চ। এখনই পদক্ষেপ নিন।`)
    }

    return alerts.join(' ') || `আপনার ${crop.cropType} ঝুঁকিতে আছে (${prediction.riskLevel})। নিয়মিত পরীক্ষা করুন এবং সংরক্ষণের অবস্থা উন্নত করুন।`
}

/**
 * Get crop risk prediction (same logic as prediction controller)
 */
async function getCropRiskPrediction(crop, user) {
    try {
        // Get full user data with location
        const userData = await User.findById(user._id).select('latitude longitude district')
        
        if (!userData || !userData.latitude || !userData.longitude) {
            throw new Error('User location not set')
        }

        // Generate sensor data
        const sensorData = generateMockSensorData(crop._id, 7)
        
        // Get weather forecast
        const weatherForecast = await getWeatherForPrediction(userData)
        
        // Calculate risk
        const prediction = calculateETCL(sensorData, weatherForecast, crop.storageType, crop._id)
        
        return {
            riskLevel: prediction.riskLevel,
            riskScore: prediction.riskScore,
            etcl: prediction.etcl,
            issues: prediction.factors,
            currentConditions: prediction.currentConditions
        }
    } catch (error) {
        console.error('Error getting crop risk prediction:', error)
        // Return default prediction
        return {
            riskLevel: 'Medium',
            riskScore: 50,
            etcl: 168,
            issues: ['Unable to calculate risk'],
            currentConditions: {
                temperature: crop.temperature || 25,
                moisture: 15,
                humidity: crop.humidity || 70
            }
        }
    }
}

/**
 * Get weather data for user's location
 */
async function getWeatherDataForUser(user) {
    try {
        // Get full user data with location
        const userData = await User.findById(user._id).select('latitude longitude district')
        
        if (!userData || !userData.latitude || !userData.longitude) {
            return { current: null, tomorrow: null, forecast: [] }
        }

        // Get weather forecast
        const weatherForecast = await getWeatherForPrediction(userData)
        
        if (weatherForecast && weatherForecast.length > 0) {
            return {
                current: {
                    temp: weatherForecast[0].tempAvg,
                    humidity: weatherForecast[0].humidity,
                    description: weatherForecast[0].description
                },
                tomorrow: weatherForecast[1] ? {
                    temp: weatherForecast[1].tempAvg,
                    humidity: weatherForecast[1].humidity,
                    description: weatherForecast[1].description
                } : null,
                forecast: weatherForecast
            }
        }

        return { current: null, tomorrow: null, forecast: [] }
    } catch (error) {
        console.error("Error fetching weather data:", error)
        return { current: null, tomorrow: null, forecast: [] }
    }
}

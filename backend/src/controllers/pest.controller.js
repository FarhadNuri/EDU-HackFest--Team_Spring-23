import { GoogleGenerativeAI } from "@google/generative-ai"
import User from "../models/auth.model.js"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyB5bEFwsdzeqaNG2KKXiTvhqrnika1UW44")

/**
 * Identify pest from uploaded image using Gemini Vision API
 */
export async function identifyPest(req, res) {
    try {
        console.log('\n🐛 Pest Identification Request Started')
        
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ success: false, message: "User not logged in" })
        }

        // Get user data for location context
        const user = await User.findById(req.user.userId)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        console.log('User:', user.fullname, '| District:', user.district)

        // Get image data from request
        const { image, cropType } = req.body

        if (!image) {
            return res.status(400).json({ success: false, message: "No image provided" })
        }

        console.log('Crop Type:', cropType || 'Not specified')
        console.log('Image size:', image.length, 'characters')

        // Call Gemini Vision API
        console.log('Calling Gemini Vision API...')
        const result = await analyzePestImage(image, cropType, user.district)

        console.log('✅ Pest identification complete')
        console.log('Pest:', result.pestName)
        console.log('Risk Level:', result.riskLevel)

        res.json({
            success: true,
            result: result,
            timestamp: new Date()
        })

    } catch (error) {
        console.error('❌ Error identifying pest:', error.message)
        console.error('Error stack:', error.stack)
        res.status(500).json({ 
            success: false, 
            message: "Failed to identify pest",
            error: error.message 
        })
    }
}

/**
 * Analyze pest image using Gemini Vision API with Google Search Grounding
 */
async function analyzePestImage(imageBase64, cropType, district) {
    try {
        // Use Gemini Pro Vision model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        // Remove data URL prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')

        // Prepare the image part
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
            }
        }

        // Create detailed prompt in Bangla
        const prompt = `
আপনি একজন কৃষি বিশেষজ্ঞ এবং কীটপতঙ্গ শনাক্তকরণ বিশেষজ্ঞ। এই ছবিটি বিশ্লেষণ করুন এবং নিচের তথ্য প্রদান করুন:

প্রসঙ্গ:
- ফসলের ধরন: ${cropType || 'নির্দিষ্ট নয়'}
- অঞ্চল: ${district || 'বাংলাদেশ'}

নির্দেশনা:
1. ছবিতে কী দেখা যাচ্ছে তা চিহ্নিত করুন (কীটপতঙ্গ, রোগ, বা ক্ষতি)
2. কীটপতঙ্গ বা রোগের নাম (বাংলা এবং ইংরেজি উভয়ে)
3. ঝুঁকির মাত্রা নির্ধারণ করুন: High (উচ্চ), Medium (মাঝারি), বা Low (কম)
4. লক্ষণ এবং প্রভাব বর্ণনা করুন
5. বাংলাদেশের স্থানীয় পদ্ধতি ব্যবহার করে চিকিৎসা পরিকল্পনা প্রদান করুন

চিকিৎসা পরিকল্পনায় অন্তর্ভুক্ত করুন:
- তাৎক্ষণিক পদক্ষেপ (এখনই কী করতে হবে)
- জৈব/প্রাকৃতিক পদ্ধতি (নিম তেল, রসুন স্প্রে, ইত্যাদি)
- রাসায়নিক পদ্ধতি (যদি প্রয়োজন হয়)
- প্রতিরোধমূলক ব্যবস্থা (ভবিষ্যতে এড়াতে)

দয়া করে নিম্নলিখিত JSON ফর্ম্যাটে উত্তর দিন:
{
  "pestName": "কীটপতঙ্গের নাম (বাংলা)",
  "pestNameEnglish": "Pest name in English",
  "riskLevel": "High/Medium/Low",
  "description": "বিস্তারিত বর্ণনা বাংলায়",
  "symptoms": ["লক্ষণ ১", "লক্ষণ ২", "লক্ষণ ৩"],
  "immediateActions": ["তাৎক্ষণিক পদক্ষেপ ১", "তাৎক্ষণিক পদক্ষেপ ২"],
  "organicTreatment": ["জৈব চিকিৎসা ১", "জৈব চিকিৎসা ২"],
  "chemicalTreatment": ["রাসায়নিক চিকিৎসা ১", "রাসায়নিক চিকিৎসা ২"],
  "prevention": ["প্রতিরোধ ১", "প্রতিরোধ ২"],
  "localRecommendations": "বাংলাদেশের জন্য বিশেষ পরামর্শ"
}

শুধুমাত্র JSON উত্তর দিন, অন্য কোন টেক্সট নয়।
`

        console.log('Sending image to Gemini Vision API...')
        console.log('Image data length:', base64Data.length)
        
        const result = await model.generateContent([prompt, imagePart])
        console.log('Gemini API call successful')
        
        const response = await result.response
        console.log('Got response from Gemini')
        
        const text = response.text()
        console.log('Raw Gemini response:', text.substring(0, 200) + '...')

        // Parse JSON response
        let parsedResult
        try {
            // Remove markdown code blocks if present
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            parsedResult = JSON.parse(cleanText)
        } catch (parseError) {
            console.error('Failed to parse JSON, using fallback')
            // Fallback response
            parsedResult = {
                pestName: "কীটপতঙ্গ শনাক্ত করা হয়েছে",
                pestNameEnglish: "Pest Identified",
                riskLevel: "Medium",
                description: text,
                symptoms: ["ছবিতে ক্ষতি দেখা যাচ্ছে"],
                immediateActions: ["বিশেষজ্ঞের পরামর্শ নিন"],
                organicTreatment: ["নিম তেল স্প্রে করুন"],
                chemicalTreatment: ["স্থানীয় কৃষি অফিসে যোগাযোগ করুন"],
                prevention: ["নিয়মিত পরীক্ষা করুন"],
                localRecommendations: "স্থানীয় কৃষি কর্মকর্তার সাথে পরামর্শ করুন"
            }
        }

        return parsedResult

    } catch (error) {
        console.error('❌ Error calling Gemini Vision API:', error.message)
        console.error('Error details:', error)
        
        // Return a user-friendly error response
        throw new Error(`Gemini API Error: ${error.message}`)
    }
}

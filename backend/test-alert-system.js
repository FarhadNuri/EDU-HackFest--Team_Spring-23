/**
 * Test script for Smart Alert System
 * 
 * This script tests the Gemini AI integration and alert generation
 */

import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = "AIzaSyB5bEFwsdzeqaNG2KKXiTvhqrnika1UW44"

async function testGeminiAPI() {
    console.log('🧪 Testing Gemini API Integration...\n')

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

        const testPrompt = `
আপনি একজন কৃষি বিশেষজ্ঞ। নিচের তথ্যের উপর ভিত্তি করে একটি সংক্ষিপ্ত, সুনির্দিষ্ট এবং কার্যকর পরামর্শ বাংলায় দিন।

ফসলের তথ্য:
- ফসলের ধরন: আলু
- ওজন: 500 কেজি
- সংরক্ষণের ধরন: গুদাম
- তাপমাত্রা: 28°C
- আর্দ্রতা: 85%

আবহাওয়ার পূর্বাভাস:
- আজকের তাপমাত্রা: 30°C
- আজকের আর্দ্রতা: 80%
- আগামীকালের আবহাওয়া: বৃষ্টি

ঝুঁকি বিশ্লেষণ:
- ঝুঁকির মাত্রা: Critical
- সমস্যা: উচ্চ তাপমাত্রা, অতিরিক্ত আর্দ্রতা

নির্দেশনা:
1. ২-৩ বাক্যে সংক্ষিপ্ত পরামর্শ দিন
2. সুনির্দিষ্ট পদক্ষেপ উল্লেখ করুন
3. জরুরি হলে "এখনই" বা "অবিলম্বে" শব্দ ব্যবহার করুন
4. শুধুমাত্র বাংলায় উত্তর দিন

পরামর্শ:
`

        console.log('📤 Sending request to Gemini API...')
        const result = await model.generateContent(testPrompt)
        const response = await result.response
        const text = response.text()

        console.log('✅ Gemini API Response:\n')
        console.log('═══════════════════════════════════════')
        console.log(text.trim())
        console.log('═══════════════════════════════════════\n')

        console.log('✅ Test Passed! Gemini API is working correctly.\n')
        
        // Simulate SMS notification
        console.log('🚨 SMS NOTIFICATION SIMULATION 🚨')
        console.log('═══════════════════════════════════════')
        console.log('To: +880 1234-567890')
        console.log('From: HarvestGuard Alert System')
        console.log('Message:')
        console.log(text.trim())
        console.log('═══════════════════════════════════════\n')

        return true
    } catch (error) {
        console.error('❌ Test Failed!')
        console.error('Error:', error.message)
        
        if (error.message.includes('API key')) {
            console.error('\n⚠️  API Key Issue: Please check your Gemini API key')
        } else if (error.message.includes('quota')) {
            console.error('\n⚠️  Quota Exceeded: API quota limit reached')
        } else if (error.message.includes('network')) {
            console.error('\n⚠️  Network Issue: Check your internet connection')
        }
        
        return false
    }
}

// Run test
console.log('╔═══════════════════════════════════════╗')
console.log('║   Smart Alert System - Test Suite    ║')
console.log('╚═══════════════════════════════════════╝\n')

testGeminiAPI().then(success => {
    if (success) {
        console.log('✅ All tests passed!')
        console.log('\n📋 Next Steps:')
        console.log('1. Start the backend server: npm run dev')
        console.log('2. Open the frontend dashboard')
        console.log('3. Click "Smart Alerts" button')
        console.log('4. Check browser console for SMS simulation')
        process.exit(0)
    } else {
        console.log('❌ Tests failed. Please fix the issues above.')
        process.exit(1)
    }
})

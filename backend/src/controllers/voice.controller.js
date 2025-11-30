import axios from 'axios'

// Function to generate audio using Google Cloud TTS
async function generateBanglaAudio(text) {
  try {
    const apiKey = process.env.GOOGLE_TTS_API_KEY
    
    if (!apiKey) {
      console.warn('⚠️ Google TTS API key not found, skipping audio generation')
      return null
    }

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`
    
    const response = await axios.post(url, {
      input: { text },
      voice: {
        languageCode: 'bn-IN',  // Bangla voice
        name: 'bn-IN-Wavenet-A', // High quality WaveNet voice
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.9,  // Slightly slower for clarity
        pitch: 0
      }
    })

    if (response.data && response.data.audioContent) {
      console.log('✅ Generated Bangla audio with Google TTS')
      return response.data.audioContent  // Base64 encoded audio
    }
    
    return null
  } catch (error) {
    console.error('❌ Google TTS error:', error.response?.data || error.message)
    return null
  }
}

export const handleVoiceQuery = async (req, res) => {
  try {
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'প্রশ্ন প্রয়োজন',
        answer: 'দুঃখিত, আপনার প্রশ্ন পাওয়া যায়নি।'
      })
    }

    console.log('Voice query received:', query)

    // Comprehensive keyword-based responses in Bangla
    const responses = {
      'ধান': 'ধান সংরক্ষণের জন্য আর্দ্রতা চৌদ্দ শতাংশের নিচে রাখুন। তাপমাত্রা পঁচিশ ডিগ্রি সেলসিয়াসের নিচে রাখা ভালো। ভালো বায়ুচলাচল নিশ্চিত করুন এবং নিয়মিত পরীক্ষা করুন।',
      'আবহাওয়া': 'আবহাওয়া তথ্য জানতে ড্যাশবোর্ডের আবহাওয়া বিভাগে যান। আমরা পাঁচ দিনের পূর্বাভাস এবং রিয়েল-টাইম তথ্য প্রদান করি।',
      'সংরক্ষণ': 'ফসল সংরক্ষণের জন্য শুষ্ক, ঠান্ডা এবং অন্ধকার জায়গা বেছে নিন। নিয়মিত তাপমাত্রা এবং আর্দ্রতা পরীক্ষা করুন। কীটপতঙ্গ থেকে রক্ষা করুন।',
      'কীটপতঙ্গ': 'কীটপতঙ্গ দেখা দিলে দ্রুত ব্যবস্থা নিন। জৈব কীটনাশক ব্যবহার করুন। সংরক্ষণাগার পরিষ্কার রাখুন এবং নিয়মিত পরিদর্শন করুন।',
      'আর্দ্রতা': 'আর্দ্রতা বেশি হলে ফসল নষ্ট হয়। ষাট শতাংশের নিচে রাখার চেষ্টা করুন। ডিহিউমিডিফায়ার ব্যবহার করতে পারেন।',
      'তাপমাত্রা': 'বেশিরভাগ ফসলের জন্য বিশ থেকে পঁচিশ ডিগ্রি সেলসিয়াস তাপমাত্রা আদর্শ। খুব গরম বা ঠান্ডা এড়িয়ে চলুন।',
      'গম': 'গম সংরক্ষণে আর্দ্রতা বারো শতাংশের নিচে রাখুন। ভালো বায়ুচলাচল নিশ্চিত করুন। শুষ্ক এবং ঠান্ডা জায়গায় রাখুন।',
      'ভুট্টা': 'ভুট্টা শুকনো জায়গায় সংরক্ষণ করুন। আর্দ্রতা তেরো শতাংশের নিচে রাখুন। কীটপতঙ্গ থেকে সাবধান থাকুন।',
      'আলু': 'আলু ঠান্ডা এবং অন্ধকার জায়গায় রাখুন। তাপমাত্রা চার থেকে আট ডিগ্রি সেলসিয়াস রাখুন। আলো থেকে দূরে রাখুন।',
      'পেঁয়াজ': 'পেঁয়াজ শুষ্ক এবং বায়ুচলাচলযুক্ত জায়গায় রাখুন। আর্দ্রতা কম রাখুন। জাল ব্যাগে রাখতে পারেন।',
      'টমেটো': 'টমেটো ঘরের তাপমাত্রায় রাখুন। পাকলে ফ্রিজে রাখতে পারেন। সরাসরি সূর্যালোক এড়িয়ে চলুন।',
      'সবজি': 'সবজি তাজা রাখতে ফ্রিজে রাখুন। পলিথিন ব্যাগে রাখবেন না। ধুয়ে শুকিয়ে রাখুন।',
      'ফল': 'ফল ঠান্ডা জায়গায় রাখুন। পাকা ফল আলাদা রাখুন। নিয়মিত পরীক্ষা করুন।',
      'রোগ': 'ফসলের রোগ দেখা দিলে আক্রান্ত অংশ সরিয়ে ফেলুন। জৈব ছত্রাকনাশক ব্যবহার করুন। বিশেষজ্ঞের পরামর্শ নিন।',
      'সার': 'জৈব সার ব্যবহার করুন। মাটি পরীক্ষা করে সার দিন। অতিরিক্ত সার ক্ষতিকর।',
      'পানি': 'নিয়মিত পানি দিন কিন্তু অতিরিক্ত নয়। সকালে পানি দেওয়া ভালো। ড্রিপ সেচ ব্যবহার করতে পারেন।',
      'বীজ': 'ভালো মানের বীজ ব্যবহার করুন। বীজ শুকনো এবং ঠান্ডা জায়গায় রাখুন। মেয়াদ দেখে নিন।',
      'মাটি': 'মাটির স্বাস্থ্য ভালো রাখুন। জৈব পদার্থ যোগ করুন। নিয়মিত মাটি পরীক্ষা করুন।',
      'ফসল': 'ফসল সঠিক সময়ে কাটুন। সকালে কাটা ভালো। সাবধানে হ্যান্ডলিং করুন।',
      'বাজার': 'বাজার দাম জানতে ড্যাশবোর্ড দেখুন। ক্রেতাদের সাথে সরাসরি যোগাযোগ করুন।',
      'দাম': 'ভালো দাম পেতে সঠিক সময়ে বিক্রি করুন। মধ্যস্থতাকারী এড়িয়ে চলুন।'
    }

    // Find matching response (check all keywords)
    let answer = null
    const queryLower = query.toLowerCase()
    
    for (const [keyword, response] of Object.entries(responses)) {
      if (queryLower.includes(keyword)) {
        answer = response
        break
      }
    }

    // Default response if no match
    if (!answer) {
      answer = 'দুঃখিত, আমি আপনার প্রশ্ন বুঝতে পারিনি। অনুগ্রহ করে ধান, গম, আলু, সংরক্ষণ, আবহাওয়া, কীটপতঙ্গ, বা কৃষি সম্পর্কে প্রশ্ন করুন।'
    }

    console.log('Sending answer:', answer)
    
    // Generate audio with Google TTS (if API key available)
    const audioContent = await generateBanglaAudio(answer)
    
    res.json({ 
      success: true, 
      answer,
      audioUrl: audioContent ? `data:audio/mp3;base64,${audioContent}` : null
    })
  } catch (error) {
    console.error('Voice query error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'ভয়েস প্রশ্ন প্রক্রিয়া করতে ব্যর্থ',
      answer: 'দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।'
    })
  }
}

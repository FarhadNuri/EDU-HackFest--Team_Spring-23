import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { axiosInstance } from '../lib/axios'

const VoiceAssistant = ({ onClose }) => {
    const { language, t } = useLanguage()
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [response, setResponse] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [availableVoices, setAvailableVoices] = useState([])
    const [selectedVoice, setSelectedVoice] = useState(null)
    const recognitionRef = useRef(null)

    useEffect(() => {
        // Monitor online status
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        if (!SpeechRecognition) {
            setError('Speech recognition not supported in this browser')
            return
        }

        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.lang = 'bn-BD'
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false

        recognitionRef.current.onresult = (event) => {
            const speechResult = event.results[0][0].transcript
            setTranscript(speechResult)
            setIsListening(false)
            handleQuery(speechResult)
        }

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error)
            setIsListening(false)

            let errorMessage = 'Could not recognize speech. Please try again.'

            if (event.error === 'network') {
                // Network error is common - provide helpful guidance
                errorMessage = language === 'bn'
                    ? 'ইন্টারনেট সংযোগ প্রয়োজন। অনুগ্রহ করে আপনার ইন্টারনেট চেক করুন এবং আবার চেষ্টা করুন। অথবা নিচে টাইপ করুন।'
                    : 'Internet connection required. Please check your connection and try again, or use text input below.'
            } else if (event.error === 'not-allowed') {
                errorMessage = language === 'bn'
                    ? 'মাইক্রোফোন অনুমতি প্রয়োজন। ব্রাউজার সেটিংসে মাইক্রোফোন অনুমতি দিন।'
                    : 'Microphone permission required. Please allow microphone access in browser settings.'
            } else if (event.error === 'no-speech') {
                errorMessage = language === 'bn'
                    ? 'কোন কথা শোনা যায়নি। আবার বলুন।'
                    : 'No speech detected. Please try speaking again.'
            } else if (event.error === 'audio-capture') {
                errorMessage = language === 'bn'
                    ? 'মাইক্রোফোন পাওয়া যায়নি। মাইক্রোফোন সংযুক্ত করুন।'
                    : 'No microphone found. Please connect a microphone.'
            } else if (event.error === 'aborted') {
                errorMessage = language === 'bn'
                    ? 'বাতিল হয়েছে। আবার চেষ্টা করুন।'
                    : 'Aborted. Please try again.'
            }

            setError(errorMessage)
        }

        recognitionRef.current.onend = () => {
            setIsListening(false)
        }

        // Load voices for speech synthesis
        if ('speechSynthesis' in window) {
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices()
                console.log('All available voices:', voices.length)

                // Filter Bangla voices
                const banglaVoices = voices.filter(v =>
                    v.lang.startsWith('bn') ||
                    v.name.toLowerCase().includes('bangla') ||
                    v.name.toLowerCase().includes('bengali')
                )

                console.log('Bangla voices found:', banglaVoices.length, banglaVoices)
                setAvailableVoices(banglaVoices)

                // Auto-select first Bangla voice
                if (banglaVoices.length > 0) {
                    setSelectedVoice(banglaVoices[0])
                    console.log('✅ Using Bangla voice:', banglaVoices[0].name)
                } else {
                    console.warn('⚠️ No Bangla voice found! Speech will use default voice.')
                }
            }

            // Load voices (Chrome needs this event)
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices
            }
            loadVoices()

            // Try again after a delay (Chrome sometimes needs this)
            setTimeout(loadVoices, 100)
        }

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            window.speechSynthesis.cancel()
        }
    }, [])

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript('')
            setResponse('')
            setError('')

            try {
                setIsListening(true)
                recognitionRef.current.start()
            } catch (err) {
                console.error('Failed to start recognition:', err)
                setIsListening(false)
                setError('Failed to start speech recognition. Please use the text input below.')
            }
        }
    }

    const handleQuery = async (query) => {
        setIsProcessing(true)
        setError('')

        try {
            const res = await axiosInstance.post('/voice/query', { query, language: 'bn' })

            if (res.data.success) {
                const answer = res.data.answer
                setResponse(answer)
                
                // If Google TTS audio is available, play it
                if (res.data.audioUrl) {
                    console.log('🎵 Playing Google TTS audio')
                    playAudio(res.data.audioUrl)
                } else {
                    // Fallback to browser speech synthesis
                    console.log('🔊 Using browser speech synthesis')
                    speakResponse(answer)
                }
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to process query'
            setError(errorMsg)
        } finally {
            setIsProcessing(false)
        }
    }

    const playAudio = (audioUrl) => {
        const audio = new Audio(audioUrl)
        
        audio.onplay = () => {
            setIsSpeaking(true)
            console.log('🎤 Started playing audio')
        }
        
        audio.onended = () => {
            setIsSpeaking(false)
            console.log('✅ Finished playing audio')
        }
        
        audio.onerror = (e) => {
            console.error('❌ Audio playback error:', e)
            setIsSpeaking(false)
            // Fallback to speech synthesis
            speakResponse(response)
        }
        
        audio.play().catch(err => {
            console.error('Failed to play audio:', err)
            // Fallback to speech synthesis
            speakResponse(response)
        })
    }

    const speakResponse = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()

            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = 'bn-BD'
            utterance.rate = 0.8  // Slower for better pronunciation
            utterance.pitch = 1
            utterance.volume = 1

            // Use selected Bangla voice if available
            if (selectedVoice) {
                utterance.voice = selectedVoice
                console.log('🔊 Speaking with:', selectedVoice.name, selectedVoice.lang)
            } else {
                console.warn('⚠️ No Bangla voice! Install Windows Bangla language pack for proper pronunciation.')
            }

            utterance.onstart = () => {
                setIsSpeaking(true)
                console.log('🎤 Started speaking')
            }
            utterance.onend = () => {
                setIsSpeaking(false)
                console.log('✅ Finished speaking')
            }
            utterance.onerror = (e) => {
                console.error('❌ Speech error:', e)
                setIsSpeaking(false)
                setError('Speech synthesis failed')
            }

            window.speechSynthesis.speak(utterance)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-lime-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    <h2 className={`text-2xl font-bold text-gray-900 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {t('Voice Assistant', 'ভয়েস সহায়ক')}
                    </h2>
                    <p className={`text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {t('Ask questions in Bangla and get spoken answers', 'বাংলায় প্রশ্ন করুন এবং কথায় উত্তর পান')}
                    </p>
                </div>

                {/* Internet Status Warning */}
                {!isOnline && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className={`text-sm text-yellow-800 font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('No internet connection. Voice recognition requires internet.', 'ইন্টারনেট সংযোগ নেই। ভয়েস রিকগনিশন ইন্টারনেট প্রয়োজন।')}
                        </p>
                    </div>
                )}

                <div className="flex flex-col items-center mb-6">
                    <button
                        onClick={startListening}
                        disabled={isProcessing || isSpeaking || isListening || !isOnline}
                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isListening
                            ? 'bg-red-500 animate-pulse'
                            : 'bg-lime-600 hover:bg-lime-700'
                            }`}
                        title={!isOnline ? 'Internet connection required' : 'Click to speak'}
                    >
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                    <p className={`mt-3 text-sm text-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {isOnline
                            ? t('Click microphone and speak in Bangla', 'মাইক্রোফোনে ক্লিক করুন এবং বাংলায় বলুন')
                            : t('Internet required for voice', 'ভয়েসের জন্য ইন্টারনেট প্রয়োজন')
                        }
                    </p>
                </div>

                <div className="text-center mb-4 h-6">
                    {isListening && (
                        <p className={`text-red-600 font-semibold animate-pulse ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Listening...', 'শুনছি...')}
                        </p>
                    )}
                    {isProcessing && (
                        <p className={`text-blue-600 font-semibold ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Processing...', 'প্রক্রিয়া করছি...')}
                        </p>
                    )}
                    {isSpeaking && (
                        <p className={`text-green-600 font-semibold ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('Speaking...', 'বলছি...')}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {transcript && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <p className={`text-sm text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {t('You asked:', 'আপনি জিজ্ঞাসা করেছেন:')}
                        </p>
                        <p className={`text-gray-900 font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>
                            {transcript}
                        </p>
                    </div>
                )}

                {response && (
                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className={`text-sm text-gray-600 mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                                    {t('Answer:', 'উত্তর:')}
                                </p>
                                <p className={`text-gray-900 font-medium ${language === 'bn' ? 'font-bengali' : ''}`}>
                                    {response}
                                </p>
                            </div>
                            <button
                                onClick={() => speakResponse(response)}
                                disabled={isSpeaking}
                                className="ml-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Help Section */}
                <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-lg p-4 border border-lime-200">
                    <p className={`text-sm font-semibold text-gray-800 mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        {t('Example Questions:', 'উদাহরণ প্রশ্ন:')}
                    </p>
                    <ul className={`text-sm text-gray-700 space-y-1 ${language === 'bn' ? 'font-bengali' : ''}`}>
                        <li>• {language === 'bn' ? 'ধান সংরক্ষণ কিভাবে করব?' : 'How to store rice?'}</li>
                        <li>• {language === 'bn' ? 'আবহাওয়া কেমন?' : 'What\'s the weather?'}</li>
                        <li>• {language === 'bn' ? 'কীটপতঙ্গ দেখলে কি করব?' : 'What about pests?'}</li>
                        <li>• {language === 'bn' ? 'আর্দ্রতা কত রাখব?' : 'What humidity level?'}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default VoiceAssistant

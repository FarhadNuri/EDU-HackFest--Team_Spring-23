import express from 'express'
import { handleVoiceQuery } from '../controllers/voice.controller.js'

const router = express.Router()

router.post('/query', handleVoiceQuery)

export default router

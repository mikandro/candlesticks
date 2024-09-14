import express from 'express'

import { CandlestickService } from './services/CandlestickService'
import WebSocketService from './services/WebSocketService'
import { CandlestickController } from './controllers/CandlestickController'

const app = express()
const candlestickService = new CandlestickService()
const wsService = new WebSocketService(candlestickService)
wsService.connect()
const candlestickController = new CandlestickController(candlestickService)

app.use('/api', candlestickController.router)

export default app

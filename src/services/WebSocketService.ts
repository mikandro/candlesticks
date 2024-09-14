import WebSocket from 'ws'
import logger from '../utils/Logger'
import { Instrument } from '../models/Instrument'
import { CandlestickService } from './CandlestickService'

interface InstrumentMessage {
    type: 'ADD' | 'DELETE'
    data: {
        description: string
        isin: string
    }
}

interface QuoteMessage {
    type: 'QUOTE'
    data: {
        price: number
        isin: string
    }
}

type WebSocketMessage = InstrumentMessage | QuoteMessage

class WebSocketService {
    private instruments: Map<string, Instrument> = new Map()
    private instrumentSocket: WebSocket | null = null
    private quoteSocket: WebSocket | null = null
    private wsUrl: string

    constructor(private candleStickService: CandlestickService) {
        this.wsUrl = process.env.PARTNER_SERVICE_URL || 'ws://localhost:8032'
        this.candleStickService = candleStickService
    }

    public connect() {
        this.connectToInstruments()
        this.connectToQuotes()
    }

    private connectToInstruments() {
        const instrumentUrl = `${this.wsUrl}/instruments`
        this.instrumentSocket = new WebSocket(instrumentUrl)

        this.instrumentSocket.on('open', () => {
            logger.info('Connected to instrument WebSocket')
        })

        this.instrumentSocket.on('message', (data: string) => {
            const message: WebSocketMessage = JSON.parse(data)
            if (message.type === 'ADD' || message.type === 'DELETE') {
                this.handleInstrumentMessage(message)
            } else {
                logger.warn(`Unhandled message type: ${message.type}`)
            }
        })

        this.instrumentSocket.on('close', () => {
            logger.warn(
                'Disconnected from instrument WebSocket. Reconnecting...'
            )
            setTimeout(() => this.connectToInstruments(), 1000)
        })

        this.instrumentSocket.on('error', (err) => {
            logger.error('Instrument WebSocket error:', err)
            this.instrumentSocket?.close()
        })
    }

    private connectToQuotes() {
        const quoteUrl = `${this.wsUrl}/quotes`
        this.quoteSocket = new WebSocket(quoteUrl)

        this.quoteSocket.on('open', () => {
            logger.info('Connected to quote WebSocket')
        })

        this.quoteSocket.on('message', (data: string) => {
            const message: WebSocketMessage = JSON.parse(data)
            if (message.type === 'QUOTE') {
                this.handleQuoteMessage(message)
            } else {
                logger.warn(`Unhandled message tyep: ${message.type}`)
            }
        })

        this.quoteSocket.on('close', () => {
            logger.warn('Disconnected from quote WebSocket. Reconnecting...')
            setTimeout(() => this.connectToQuotes(), 1000)
        })

        this.quoteSocket.on('error', (err) => {
            logger.error('Quote WebSocket error:', err)
            this.quoteSocket?.close()
        })
    }

    private handleInstrumentMessage(message: InstrumentMessage) {
        const { type, data } = message

        switch (type) {
            case 'ADD':
                this.instruments.set(data.isin, data)
                logger.info(
                    `Instrument added: ${data.isin} - ${data.description}`
                )
                break
            case 'DELETE':
                this.instruments.delete(data.isin)
                this.candleStickService.removeCandlestick(data.isin) // Cleanup associated candlestick
                logger.info(`Instrument deleted: ${data.isin}`)
                break
            default:
                logger.warn(`Unknown instrument message type: ${type}`)
        }
    }

    private handleQuoteMessage(message: QuoteMessage) {
        const { type, data } = message

        if (type === 'QUOTE' && this.instruments.has(data.isin)) {
            this.candleStickService.updateCandlestick(data.isin, data.price)
            logger.info(`Quote updated for ${data.isin}: ${data.price}`)
        } else {
            logger.warn(
                `Quote received for unknown instrument or unknown message type: ${type}`
            )
        }
    }

    public close() {
        this.instrumentSocket?.close()
        this.quoteSocket?.close()
    }
}

export default WebSocketService

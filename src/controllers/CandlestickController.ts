import express, { Request, Response, NextFunction } from 'express'
import { CandlestickService } from '../services/CandlestickService'
import { ApiError } from '../utils/ApiError'

export class CandlestickController {
    public router = express.Router() // TODO move to proper /router dir
    private candlestickService: CandlestickService

    constructor(candlestickService: CandlestickService) {
        this.candlestickService = candlestickService
        this.router.get('/candlesticks', this.getCandlesticks.bind(this))
    }

    private getCandlesticks(
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const { isin } = req.query
        if (!isin) {
            return next(ApiError.badRequest('ISIN is required'))
        }

        try {
            const candlesticks = this.candlestickService.getCandlesticks(
                isin as string
            )
            res.json(candlesticks)
        } catch (error) {
            next(ApiError.internal('Failed to retrieve candlesticks', error))
        }
    }
}

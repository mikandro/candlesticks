import logger from '../utils/Logger'

import { Candlestick } from '../models/Candlestick'

export class CandlestickService {
    private candlesticks: Map<string, Candlestick[]> = new Map()

    public updateCandlestick(isin: string, price: number): void {
        try {
            const currentCandlesticks = this.candlesticks.get(isin) || []

            const lastCandlestick =
                currentCandlesticks[currentCandlesticks.length - 1]
            const now = new Date()
            const minute = Math.floor(now.getTime() / 60000) * 60000 // Floor to the current minute
            const timestamp = new Date(minute)

            if (
                !lastCandlestick ||
                lastCandlestick.closeTimestamp <= timestamp
            ) {
                const newCandle: Candlestick = {
                    isin,
                    openTimestamp: timestamp,
                    closeTimestamp: new Date(minute + 60 * 1000),
                    openPrice: price,
                    closePrice: price,
                    highPrice: price,
                    lowPrice: price,
                }
                currentCandlesticks.push(newCandle)
            } else {
                lastCandlestick.closePrice = price
                lastCandlestick.highPrice = Math.max(
                    lastCandlestick.highPrice,
                    price
                )
                lastCandlestick.lowPrice = Math.min(
                    lastCandlestick.lowPrice,
                    price
                )
            }

            this.candlesticks.set(isin, currentCandlesticks)
        } catch (error) {
            logger.error('Failed to update candlestick', { error })
            throw new Error('Internal Server Error')
        }
    }

    public getCandlesticks(isin: string): Candlestick[] {
        try {
            const currentCandlesticks = this.candlesticks.get(isin) || []
            const last30MinutesCandlesticks = currentCandlesticks.filter(
                (c) => {
                    return (
                        c.openTimestamp.getTime() >= Date.now() - 30 * 60 * 1000
                    )
                }
            )

            return last30MinutesCandlesticks
        } catch (error) {
            logger.error('Failed to retrieve candlesticks', { error })
            throw new Error('Internal Server Error')
        }
    }

    public removeCandlestick(isin: string) {
        if (this.candlesticks.has(isin)) {
            logger.info('Removed candlestick', { isin })
            this.candlesticks.delete(isin)
        } else {
            logger.info('No candlesticks found for deletion', { isin })
        }
    }
}

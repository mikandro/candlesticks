export interface Candlestick {
    isin: string
    openTimestamp: Date
    closeTimestamp: Date
    openPrice: number
    closePrice: number
    highPrice: number
    lowPrice: number
}

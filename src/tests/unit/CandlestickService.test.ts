import { CandlestickService } from '../../services/CandlestickService'

describe('candlestickService', () => {
    const ISIN1 = 'TEST_ISIN1'
    const ISIN2 = 'TEST_ISIN2'
    const candlestickService = new CandlestickService()

    beforeEach(() => {
        candlestickService.removeCandlestick(ISIN1)
        candlestickService.removeCandlestick(ISIN2)
    })
    afterEach(() => {
        jest.useRealTimers()
    })

    it('should create a new Candlestick when updateCandlestick is called for the first time', () => {
        candlestickService.updateCandlestick(ISIN1, 100)

        const Candlesticks = candlestickService.getCandlesticks(ISIN1)
        expect(Candlesticks).toBeDefined()
        expect(Candlesticks.length).toBe(1)

        const candle = Candlesticks[0]
        expect(candle.openPrice).toBe(100)
        expect(candle.closePrice).toBe(100)
        expect(candle.highPrice).toBe(100)
        expect(candle.lowPrice).toBe(100)
    })

    it('should update the existing Candlestick within the same minute', () => {
        candlestickService.updateCandlestick(ISIN1, 100)
        candlestickService.updateCandlestick(ISIN1, 110)
        candlestickService.updateCandlestick(ISIN1, 90)

        const Candlesticks = candlestickService.getCandlesticks(ISIN1)
        expect(Candlesticks).toBeDefined()
        expect(Candlesticks.length).toBe(1)

        const candle = Candlesticks[0]
        expect(candle.openPrice).toBe(100)
        expect(candle.closePrice).toBe(90)
        expect(candle.highPrice).toBe(110)
        expect(candle.lowPrice).toBe(90)
    })

    it('should create a new Candlestick for a new minute', () => {
        jest.useFakeTimers()
        const initialTimestamp = new Date().getTime()

        jest.setSystemTime(new Date(initialTimestamp))
        candlestickService.updateCandlestick(ISIN1, 100)

        // Advance time by 1 minute
        jest.setSystemTime(new Date(initialTimestamp + 60000))

        candlestickService.updateCandlestick(ISIN1, 110)

        const Candlesticks = candlestickService.getCandlesticks(ISIN1)
        expect(Candlesticks).toBeDefined()
        expect(Candlesticks.length).toBe(2)

        const firstCandle = Candlesticks[0]
        expect(firstCandle.openPrice).toBe(100)
        expect(firstCandle.closePrice).toBe(100)

        const secondCandle = Candlesticks[1]
        expect(secondCandle.openPrice).toBe(110)
        expect(secondCandle.closePrice).toBe(110)
    })

    it('should remove all Candlesticks for a given ISIN', () => {
        candlestickService.updateCandlestick(ISIN1, 100)
        candlestickService.removeCandlestick(ISIN1)

        const Candlesticks = candlestickService.getCandlesticks(ISIN1)
        expect(Candlesticks).toEqual([])
    })

    it('should correctly update candlestick with out-of-order messages', () => {
        jest.useFakeTimers()
        const initialTimestamp = new Date().getTime()
        const minute = Math.floor(initialTimestamp / 60000) * 60000 // Floor to the current minute

        jest.setSystemTime(new Date(minute))
        candlestickService.updateCandlestick(ISIN1, 100) // Initial price

        // Advance time by 30 seconds
        jest.setSystemTime(new Date(minute + 30000))
        candlestickService.updateCandlestick(ISIN1, 110) // Higher price

        // Go back in time by 20 seconds
        jest.setSystemTime(new Date(minute + 10000))
        candlestickService.updateCandlestick(ISIN1, 90) // Lower price, earlier than previous

        // Advance time by 40 seconds
        jest.setSystemTime(new Date(minute + 40000))
        candlestickService.updateCandlestick(ISIN1, 120) // Even higher price

        const candlesticks = candlestickService.getCandlesticks(ISIN1)
        expect(candlesticks).toBeDefined()
        expect(candlesticks!.length).toBe(1)

        const candle = candlesticks![0]
        expect(candle.openPrice).toBe(100) // First received price
        expect(candle.highPrice).toBe(120) // Highest price
        expect(candle.lowPrice).toBe(90) // Lowest price
        expect(candle.closePrice).toBe(120) // Last received price
    })

    it('should handle updates for multiple instruments', () => {
        candlestickService.updateCandlestick(ISIN1, 100)
        candlestickService.updateCandlestick(ISIN2, 200)

        const candlesticks1 = candlestickService.getCandlesticks(ISIN1)
        const candlesticks2 = candlestickService.getCandlesticks(ISIN2)

        expect(candlesticks1).toBeDefined()
        expect(candlesticks2).toBeDefined()

        expect(candlesticks1.length).toBe(1)
        expect(candlesticks2.length).toBe(1)

        expect(candlesticks1[0].openPrice).toBe(100)
        expect(candlesticks2[0].openPrice).toBe(200)
    })

    it('should handle extreme price values', () => {
        candlestickService.updateCandlestick(ISIN1, -100) // TODO This is not possible of course.
        candlestickService.updateCandlestick(ISIN1, 1e9)

        const candlesticks = candlestickService.getCandlesticks(ISIN1)
        expect(candlesticks).toBeDefined()
        expect(candlesticks.length).toBe(1)

        const candle = candlesticks[0]
        expect(candle.openPrice).toBe(-100)
        expect(candle.closePrice).toBe(1e9)
        expect(candle.highPrice).toBe(1e9)
        expect(candle.lowPrice).toBe(-100)
    })

    it('should return empy array for non-existent ISIN', () => {
        const candlesticks =
            candlestickService.getCandlesticks('NON_EXISTENT_ISIN')
        expect(candlesticks).toEqual([])
    })

    it('should correctly process timestamp at the end of a minute', () => {
        jest.useFakeTimers()
        const initialTimestamp = new Date().getTime()
        const minute = Math.floor(initialTimestamp / 60000) * 60000 // Floor to the current minute

        jest.setSystemTime(new Date(initialTimestamp))
        candlestickService.updateCandlestick(ISIN1, 100)

        // Advance time by 59 seconds
        jest.setSystemTime(new Date(minute + 59000))
        candlestickService.updateCandlestick(ISIN1, 110)

        const candlesticks = candlestickService.getCandlesticks(ISIN1)
        expect(candlesticks).toBeDefined()
        expect(candlesticks.length).toBe(1)

        const candle = candlesticks[0]
        expect(candle.openPrice).toBe(100)
        expect(candle.closePrice).toBe(110)
        expect(candle.highPrice).toBe(110)
        expect(candle.lowPrice).toBe(100)
    })
})

import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import logger from './utils/Logger'

const PORT = process.env.PORT || 9000

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
;(async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })

        // TODO Implement graceful shutdown. Close ws connections, subscribers...
        // process.on('SIGTERM', shutdown)
        // process.on('SIGINT', shutdown)
    } catch (error) {
        logger.error('Failed to start application', error)
    }
})().catch((error) => {
    logger.error(error)
})

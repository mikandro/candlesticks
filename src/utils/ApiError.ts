export class ApiError extends Error {
    public statusCode: number
    public message: string
    public details?: unknown

    constructor(statusCode: number, message: string, details?: unknown) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.details = details
        this.name = this.constructor.name
    }

    public static badRequest(msg: string, details?: unknown) {
        return new ApiError(400, msg, details)
    }

    public static internal(msg: string, details?: unknown) {
        return new ApiError(500, msg, details)
    }

    public static notFound(msg: string, details?: unknown) {
        return new ApiError(404, msg, details)
    }

    public static unauthorized(msg: string, details?: unknown) {
        return new ApiError(401, msg, details)
    }
}

import { NextResponse } from 'next/server'
import { logger } from './logger'

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

export function handleApiError(error: unknown, context?: Record<string, unknown>) {
    // Log the error
    if (error instanceof Error) {
        logger.error('API Error', error, context)
    } else {
        logger.error('Unknown API Error', undefined, { error, ...context })
    }

    // Return appropriate response
    if (error instanceof ApiError) {
        return NextResponse.json(
            {
                error: error.message,
                code: error.code,
            },
            { status: error.statusCode }
        )
    }

    // Default error response
    return NextResponse.json(
        {
            error: process.env.NODE_ENV === 'development'
                ? (error instanceof Error ? error.message : 'Unknown error')
                : 'An unexpected error occurred',
        },
        { status: 500 }
    )
}

// Common API errors
export const ApiErrors = {
    unauthorized: () => new ApiError(401, 'Unauthorized', 'UNAUTHORIZED'),
    forbidden: () => new ApiError(403, 'Forbidden', 'FORBIDDEN'),
    notFound: (resource = 'Resource') => new ApiError(404, `${resource} not found`, 'NOT_FOUND'),
    badRequest: (message = 'Bad request') => new ApiError(400, message, 'BAD_REQUEST'),
    conflict: (message = 'Resource already exists') => new ApiError(409, message, 'CONFLICT'),
    tooManyRequests: () => new ApiError(429, 'Too many requests', 'RATE_LIMIT_EXCEEDED'),
    internal: (message = 'Internal server error') => new ApiError(500, message, 'INTERNAL_ERROR'),
}

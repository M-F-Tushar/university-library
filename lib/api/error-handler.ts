import { NextResponse } from 'next/server'

/**
 * Standard API error codes
 */
export const ErrorCodes = {
    // Authentication & Authorization
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    
    // Validation
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
    
    // Resources
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    CONFLICT: 'CONFLICT',
    
    // Rate Limiting
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    
    // Server Errors
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
    
    // File Upload
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    UPLOAD_FAILED: 'UPLOAD_FAILED',
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

/**
 * Custom API Error class
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public code: ErrorCode,
        message: string,
        public details?: unknown
    ) {
        super(message)
        this.name = 'ApiError'
    }
    
    static badRequest(message: string, code: ErrorCode = ErrorCodes.INVALID_INPUT, details?: unknown) {
        return new ApiError(400, code, message, details)
    }
    
    static unauthorized(message = 'Authentication required') {
        return new ApiError(401, ErrorCodes.UNAUTHORIZED, message)
    }
    
    static forbidden(message = 'Access denied') {
        return new ApiError(403, ErrorCodes.FORBIDDEN, message)
    }
    
    static notFound(message = 'Resource not found') {
        return new ApiError(404, ErrorCodes.NOT_FOUND, message)
    }
    
    static conflict(message: string) {
        return new ApiError(409, ErrorCodes.CONFLICT, message)
    }
    
    static tooManyRequests(message = 'Too many requests. Please try again later.') {
        return new ApiError(429, ErrorCodes.RATE_LIMIT_EXCEEDED, message)
    }
    
    static internal(message = 'An unexpected error occurred') {
        return new ApiError(500, ErrorCodes.INTERNAL_ERROR, message)
    }
    
    static database(message = 'Database operation failed') {
        return new ApiError(500, ErrorCodes.DATABASE_ERROR, message)
    }
}

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: {
        code: ErrorCode
        message: string
        details?: unknown
    }
    meta?: {
        page?: number
        limit?: number
        total?: number
        hasMore?: boolean
    }
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, meta?: ApiResponse['meta'], status = 200) {
    const response: ApiResponse<T> = {
        success: true,
        data,
    }
    
    if (meta) {
        response.meta = meta
    }
    
    return NextResponse.json(response, { status })
}

/**
 * Create an error response from an ApiError
 */
export function errorResponse(error: ApiError) {
    const response: ApiResponse = {
        success: false,
        error: {
            code: error.code,
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && error.details 
                ? { details: error.details } 
                : {}),
        },
    }
    
    return NextResponse.json(response, { status: error.statusCode })
}

/**
 * Handle any error and return appropriate response
 */
export function handleApiError(error: unknown): NextResponse {
    // Known API errors
    if (error instanceof ApiError) {
        return errorResponse(error)
    }
    
    // Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
        return errorResponse(
            ApiError.badRequest('Validation failed', ErrorCodes.VALIDATION_ERROR, error)
        )
    }
    
    // Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string; message: string }
        
        // Unique constraint violation
        if (prismaError.code === 'P2002') {
            return errorResponse(
                ApiError.conflict('A record with this value already exists')
            )
        }
        
        // Record not found
        if (prismaError.code === 'P2025') {
            return errorResponse(ApiError.notFound())
        }
        
        // Other Prisma errors
        return errorResponse(ApiError.database())
    }
    
    // Log unexpected errors (in production, use proper logging service)
    console.error('Unexpected API error:', error)
    
    // Return generic error for unknown errors
    return errorResponse(ApiError.internal())
}

/**
 * Wrapper for API route handlers with automatic error handling
 */
export async function withErrorHandler<T>(
    handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T>> {
    try {
        return await handler()
    } catch (error) {
        return handleApiError(error) as NextResponse<T>
    }
}

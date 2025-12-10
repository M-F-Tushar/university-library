import { NextResponse } from 'next/server'
import { successResponse } from './error-handler'

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
    data: T[],
    options: {
        page: number
        limit: number
        total: number
    },
    status = 200
) {
    return successResponse(data, {
        page: options.page,
        limit: options.limit,
        total: options.total,
        hasMore: options.page * options.limit < options.total,
    }, status)
}

/**
 * Parse pagination params from URL
 */
export function getPaginationParams(searchParams: URLSearchParams) {
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const skip = (page - 1) * limit

    return { page, limit, skip }
}

/**
 * Create a created response (201)
 */
export function createdResponse<T>(data: T) {
    return successResponse(data, undefined, 201)
}

/**
 * Create a no content response (204)
 */
export function noContentResponse() {
    return new NextResponse(null, { status: 204 })
}

/**
 * Standard response messages
 */
export const ResponseMessages = {
    CREATED: 'Created successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Access denied',
} as const

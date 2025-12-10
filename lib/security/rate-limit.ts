import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
    [key: string]: {
        tokens: number
        lastRefill: number
    }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
    maxTokens: number // Maximum tokens in bucket
    refillRate: number // Tokens added per second
    windowMs: number // Time window in milliseconds
}

const defaultConfig: RateLimitConfig = {
    maxTokens: 10,
    refillRate: 1,
    windowMs: 60000, // 1 minute
}

export function rateLimit(config: Partial<RateLimitConfig> = {}) {
    const finalConfig = { ...defaultConfig, ...config }

    return async (req: NextRequest, identifier?: string) => {
        // Use custom identifier or x-forwarded-for header
        const key = identifier || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous'
        const now = Date.now()

        // Initialize or get existing bucket
        if (!store[key]) {
            store[key] = {
                tokens: finalConfig.maxTokens,
                lastRefill: now,
            }
        }

        const bucket = store[key]
        const timePassed = now - bucket.lastRefill
        const tokensToAdd = (timePassed / 1000) * finalConfig.refillRate

        // Refill tokens
        bucket.tokens = Math.min(finalConfig.maxTokens, bucket.tokens + tokensToAdd)
        bucket.lastRefill = now

        // Check if request can proceed
        if (bucket.tokens >= 1) {
            bucket.tokens -= 1
            return null // Allow request
        }

        // Rate limit exceeded
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
                status: 429,
                headers: {
                    'Retry-After': String(Math.ceil((1 - bucket.tokens) / finalConfig.refillRate)),
                }
            }
        )
    }
}

// Cleanup old entries periodically (optional, for production use Redis instead)
setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach(key => {
        if (now - store[key].lastRefill > 3600000) { // 1 hour
            delete store[key]
        }
    })
}, 3600000) // Run every hour

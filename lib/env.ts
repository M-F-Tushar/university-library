import { z } from 'zod'

/**
 * Environment variable validation schema
 * Validates all required environment variables at startup
 */
const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    
    // NextAuth
    NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
    NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL').optional(),
    
    // Node environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

/**
 * Server-side environment variables
 * Access these via `env.DATABASE_URL` etc.
 */
function validateEnv() {
    const parsed = envSchema.safeParse(process.env)
    
    if (!parsed.success) {
        console.error('❌ Invalid environment variables:')
        console.error(parsed.error.flatten().fieldErrors)
        throw new Error('Invalid environment variables. Check your .env file.')
    }
    
    return parsed.data
}

// Only validate on the server
export const env = typeof window === 'undefined' 
    ? validateEnv() 
    : {} as z.infer<typeof envSchema>

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>

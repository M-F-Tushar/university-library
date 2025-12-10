import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { rateLimit } from '@/lib/security/rate-limit';
import { ApiError, handleApiError, successResponse, errorResponse } from '@/lib/api/error-handler';
import { NextRequest } from 'next/server';

// Rate limiter for registration: 5 attempts per 15 minutes
const registerLimiter = rateLimit({
    maxTokens: 5,
    refillRate: 0.33, // ~5 per 15 min
    windowMs: 900000, // 15 minutes
});

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ADMIN', 'STUDENT']).optional(),
});

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const rateLimitResult = await registerLimiter(request);
        if (rateLimitResult) {
            return rateLimitResult;
        }

        const body = await request.json();
        const validatedData = registerSchema.parse(body);
        const { name, email, password, role } = validatedData;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return errorResponse(
                ApiError.conflict('A user with this email already exists')
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'STUDENT',
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return successResponse(
            { message: 'User created successfully', user: userWithoutPassword },
            undefined,
            201
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return errorResponse(
                ApiError.badRequest('Invalid input', 'VALIDATION_ERROR', error.flatten())
            );
        }
        return handleApiError(error);
    }
}

import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { auth } from '@/auth';
import { rateLimit } from '@/lib/security/rate-limit';
import { validateFile, sanitizeFilename } from '@/lib/security/file-validation';
import { ApiError, handleApiError, successResponse, errorResponse } from '@/lib/api/error-handler';

// Rate limiter for uploads: 10 uploads per 15 minutes
const uploadLimiter = rateLimit({
    maxTokens: 10,
    refillRate: 0.67, // ~10 per 15 min
    windowMs: 900000, // 15 minutes
});

// Maximum file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user) {
            return errorResponse(ApiError.unauthorized());
        }

        // Rate limiting
        const rateLimitResult = await uploadLimiter(request, session.user.id);
        if (rateLimitResult) {
            return rateLimitResult;
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return errorResponse(ApiError.badRequest('No file provided'));
        }

        // Validate file type
        const typeValidation = validateFile(file, ['document', 'image']);
        if (!typeValidation.valid) {
            return errorResponse(
                ApiError.badRequest(typeValidation.error || 'Invalid file type', 'INVALID_FILE_TYPE')
            );
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return errorResponse(
                ApiError.badRequest(
                    `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of 50MB`,
                    'FILE_TOO_LARGE'
                )
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename to prevent path traversal and special characters
        const sanitizedName = sanitizeFilename(file.name);
        const filename = `${Date.now()}-${sanitizedName}`;
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        const filepath = join(uploadDir, filename);

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        // Save file
        await writeFile(filepath, buffer);

        // Return public URL
        const url = `/uploads/${filename}`;
        return successResponse({ url });
    } catch (error) {
        return handleApiError(error);
    }
}

const ALLOWED_FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    presentation: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    text: ['text/plain', 'text/markdown'],
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export interface FileValidationResult {
    valid: boolean
    error?: string
}

export function validateFileType(file: File, allowedCategories: (keyof typeof ALLOWED_FILE_TYPES)[]): FileValidationResult {
    const allowedTypes = allowedCategories.flatMap(cat => ALLOWED_FILE_TYPES[cat])

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
        }
    }

    return { valid: true }
}

export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): FileValidationResult {
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`
        }
    }

    return { valid: true }
}

export function sanitizeFilename(filename: string): string {
    // Remove path traversal attempts
    let sanitized = filename.replace(/\.\./g, '')

    // Remove special characters except dots, hyphens, and underscores
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_')

    // Ensure filename isn't too long
    if (sanitized.length > 255) {
        const ext = sanitized.split('.').pop()
        sanitized = sanitized.substring(0, 250) + '.' + ext
    }

    return sanitized
}

export function validateFile(
    file: File,
    allowedCategories: (keyof typeof ALLOWED_FILE_TYPES)[],
    maxSize?: number
): FileValidationResult {
    const typeValidation = validateFileType(file, allowedCategories)
    if (!typeValidation.valid) return typeValidation

    const sizeValidation = validateFileSize(file, maxSize)
    if (!sizeValidation.valid) return sizeValidation

    return { valid: true }
}

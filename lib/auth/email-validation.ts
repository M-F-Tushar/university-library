import prisma from '@/lib/prisma';

/**
 * Get the allowed email domain from site settings
 */
export async function getAllowedEmailDomain(): Promise<string | null> {
    const setting = await prisma.siteSettings.findUnique({
        where: { key: 'allowed_email_domain' }
    });
    return setting?.value || null;
}

/**
 * Check if an email address is from the allowed domain
 */
export async function isEmailAllowed(email: string): Promise<boolean> {
    const allowedDomain = await getAllowedEmailDomain();
    if (!allowedDomain) return false;
    return email.toLowerCase().endsWith(allowedDomain.toLowerCase());
}

/**
 * Validate email domain and return error message if invalid
 */
export async function validateEmailDomain(email: string): Promise<{ valid: boolean; error?: string }> {
    const allowedDomain = await getAllowedEmailDomain();

    if (!allowedDomain) {
        return { valid: false, error: 'Email domain not configured. Please contact admin.' };
    }

    if (!email.toLowerCase().endsWith(allowedDomain.toLowerCase())) {
        return { valid: false, error: `Only ${allowedDomain} email addresses are allowed.` };
    }

    return { valid: true };
}

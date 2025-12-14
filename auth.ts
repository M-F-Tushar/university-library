import NextAuth from 'next-auth';
import { sendMagicLinkEmail } from '@/lib/email/send-magic-link';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Email from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { validateEmailDomain } from '@/lib/auth/email-validation';

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as any,
    session: {
        strategy: 'jwt', // Use JWT strategy even with adapter to avoid database session lookup overhead if desired, or 'database'
    },
    providers: [
        Email({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            sendVerificationRequest: async ({ identifier: email, url }) => {
                const result = await sendMagicLinkEmail({ email, url });
                if (!result.success) {
                    throw new Error(result.error);
                }
            },
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await prisma.user.findUnique({ where: { email } });

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        return user;
                    }
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // Check allowed domain for email login
            if (account?.provider === 'email' && user.email) {
                const isValid = await validateEmailDomain(user.email);
                if (!isValid.valid) {
                    return false; // Return false to deny access
                }
                return true;
            }
            return true;
        },
        ...authConfig.callbacks, // Merge with existing callbacks
    },
});

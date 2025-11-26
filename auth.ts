import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log('=== AUTH ATTEMPT ===');
                console.log('Credentials received:', credentials);

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                console.log('Parsed credentials:', parsedCredentials.success);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    console.log('Looking for user:', email);

                    const user = await prisma.user.findUnique({ where: { email } });
                    console.log('User found:', user ? `Yes (${user.email}, ${user.role})` : 'No');

                    if (!user) return null;

                    if (!user) return null;

                    console.log('Comparing passwords...');
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log('Passwords match:', passwordsMatch);

                    if (passwordsMatch) {
                        console.log('Login successful!');
                        return user;
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    // Only protect admin routes, allow public access to main site
    matcher: ['/admin/:path*'],
};

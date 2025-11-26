import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdmin = auth?.user?.role === 'ADMIN';
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnLogin = nextUrl.pathname.startsWith('/login');

            // Protect admin routes
            if (isOnAdmin) {
                if (isLoggedIn && isAdmin) return true;
                return false; // Redirect to login
            }

            // Redirect logged-in users away from login page
            if (isOnLogin && isLoggedIn) {
                return Response.redirect(new URL('/resources', nextUrl));
            }

            // Allow public access to main site
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

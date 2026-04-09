import connectDB from '@/config/database/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        // 🔐 Google OAuth
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),

        // 🔑 Email / Password (Credentials)
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Missing email or password');
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                // Google-only account
                if (!user.password) {
                    throw new Error('Please sign in with Google');
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid) {
                    throw new Error('Invalid email or password');
                }

                // IMPORTANT: return role so it reaches JWT
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.username,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        // ✅ Runs on OAuth sign in (Google)
        async signIn({ user, profile, account }) {
            if (account.provider === 'google') {
                await connectDB();

                let existingUser = await User.findOne({ email: profile.email });

                if (!existingUser) {
                    const username = profile.name?.slice(0, 20) || 'User';

                    existingUser = await User.create({
                        email: profile.email,
                        username,
                        image: profile.picture,
                        role:
                            profile.email === process.env.ADMIN_EMAIL
                                ? 'admin'
                                : 'user',
                    });
                }

                // Attach role to user so jwt callback receives it
                user.role = existingUser.role;
            }

            return true;
        },

        // ✅ JWT is used by middleware
        async jwt({ token, user }) {
            // On first login
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },

        // ✅ Session is used by client (`useSession`)
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            return session;
        },
    },

    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: '/login',
    },

    secret: process.env.NEXTAUTH_SECRET,
};

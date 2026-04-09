'use server';

import connectDB from '@/config/database/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
// import { signIn } from 'next-auth';
import { redirect } from 'next/navigation';

/* ---------------- REGISTER ---------------- */

export async function registerUser(prevState, formData) {
    try {

        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        if (!username || !email || !password) {
            return { error: 'All fields are required' };
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: 'User already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
        await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });

    } catch (error) {
        return { error: 'Something went wrong' };
    }
    // 🚀 MUST NOT BE CAUGHT
    redirect('/login');
}

/* ---------------- LOGIN ---------------- */

// export async function loginUser(prevState, formData) {
//     const email = formData.get('email');
//     const password = formData.get('password');

//     if (!email || !password) {
//         return { error: 'Email and password are required' };
//     }

//     const res = await signIn('credentials', {
//         email,
//         password,
//         redirect: false,
//     });

//     if (res?.error) {
//         return { error: 'Invalid email or password' };
//     }

//     redirect('/');
// }

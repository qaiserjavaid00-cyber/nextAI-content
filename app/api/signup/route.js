import connectDB from '@/config/database/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    const { email, password, username } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return Response.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
        email,
        username,
        password: hashedPassword,
    });

    return Response.json({ message: 'User created successfully' }, { status: 201 });
}

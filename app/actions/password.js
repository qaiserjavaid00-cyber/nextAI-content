'use server';

import connectDB from "@/config/database/db";
import User from "@/models/User";
import PasswordReset from "@/models/passwordReset";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function resetPasswordAction(token, newPassword) {
    await connectDB();

    const reset = await PasswordReset.findOne({ token });
    if (!reset || reset.expiresAt < new Date()) {
        return { ok: false, message: "Invalid or expired token" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await User.findOneAndUpdate({ email: reset.email }, { password: hashedPassword });

    await PasswordReset.deleteOne({ token });

    return { ok: true, message: "Password reset successfully" };
}


export async function requestPasswordResetAction(email) {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return { ok: false, message: "Email not found" };

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await PasswordReset.create({ email, token, expiresAt });

    const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;

    await sendEmail({
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Token expires in 1 hour.</p>`,
    });

    return { ok: true };
}


export async function updateUserProfile(userId, { username, email, imageFile }) {
    // Connect to MongoDB if not connected
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }

    let imageUrl;

    if (imageFile) {
        // Upload to Cloudinary if new file is selected
        const uploaded = await cloudinary.uploader.upload(imageFile, {
            folder: "users",
            width: 256,
            height: 256,
            crop: "fill",
        });
        imageUrl = uploaded.secure_url;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            username,
            email,
            ...(imageUrl ? { image: imageUrl } : {}), // only update image if new one uploaded
        },
        { new: true, runValidators: true }
    ).lean();

    return {
        id: updatedUser._id.toString(),
        name: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.image || null,
        role: updatedUser.role,
    };
}

export async function getUserById(userId) {
    await connectDB();

    const user = await User.findById(userId).lean();

    if (!user) return null;

    // ✅ normalize shape (VERY IMPORTANT)
    return {
        id: user._id.toString(),
        name: user.username,
        email: user.email,
        image: user.image || null,
        role: user.role,
    };
}



export async function changePassword(userId, currentPassword, newPassword) {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Verify current password
    if (!(await bcrypt.compare(currentPassword, user.password))) {
        throw new Error("Current password is incorrect");
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;
    await user.save();

    return true;
}
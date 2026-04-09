import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: [true, 'Email already exists'],
            required: [true, 'Email is required'],
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
        },
        password: {
            type: String,
            // required: [true, 'Password is required'],
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user', // default role for everyone else
        },
    },
    {
        timestamps: true,
    }
);

const User = models.User || model('User', UserSchema);
export default User;

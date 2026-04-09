import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export default mongoose.models.PasswordReset ||
    mongoose.model("PasswordReset", passwordResetSchema);
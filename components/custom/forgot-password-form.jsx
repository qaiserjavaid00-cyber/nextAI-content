"use client";

import { useState, useTransition } from "react";
import { requestPasswordResetAction } from "@/app/actions/password";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e) => {
        e.preventDefault();

        startTransition(async () => {
            const res = await requestPasswordResetAction(email);

            if (res.ok) {
                setMessage("✅ Reset link sent to your email");
            } else {
                setMessage("❌ " + res.message);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-6 border rounded-lg shadow"
            >
                <h2 className="text-xl font-semibold mb-4">
                    Forgot Password
                </h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-black text-white p-2 rounded"
                >
                    {isPending ? <div className="flex gap-2"><Loader2 className="animate-spin" /><span>Sending</span></div> : "Send Reset Link"}
                </button>

                {message && (
                    <p className="mt-3 text-sm text-center">{message}</p>
                )}
            </form>
        </div>
    );
}
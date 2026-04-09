'use client';
import { useState, useTransition } from "react";
import { resetPasswordAction } from "@/app/actions/password";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function ResetPassword({ token }) {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleReset = async (e) => {
        e.preventDefault();
        startTransition(async () => {
            const res = await resetPasswordAction(token, password);

            if (res.ok) {
                setMessage("✅ Password has been Changed");
            } else {
                setMessage("❌ " + res.message);
            }
        });

    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleReset}
                className="w-full max-w-md p-6 border rounded-lg shadow"
            >
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Reset Password
                </h2>
                <Input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2"
                >
                    {isPending ? <div className="flex gap-2 items-center justify-center"><Loader2 className="animate-spin" /><span>wait...</span></div> : "Reset"}


                </Button>
                {message && (
                    <p className="mt-3 text-sm text-center">{message}</p>
                )}
            </form>
        </div>
    );
}


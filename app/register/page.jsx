'use client';

import { useFormState } from 'react-dom';
import { registerUser } from '@/app/actions/auth';
import SubmitButton from '@/components/ui/SubmitButton';

const initialState = { error: null };

export default function RegisterPage() {
    const [state, formAction] = useFormState(registerUser, initialState);

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Register</h1>

            {state.error && (
                <p className="mb-4 text-red-500 text-sm">{state.error}</p>
            )}

            <form action={formAction} className="space-y-4">
                <input
                    name="username"
                    placeholder="Username"
                    required
                    className="w-full border p-2"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full border p-2"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full border p-2"
                />

                <SubmitButton>Register</SubmitButton>
            </form>
        </div>
    );
}

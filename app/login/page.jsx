// 'use client';

// import { signIn } from 'next-auth/react';
// import { useState } from 'react';
// // import { useRouter } from 'next/navigation';
// import { Loader2 } from 'lucide-react';
// import Link from 'next/link';


// export default function LoginPage() {
//     // const router = useRouter();
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);

//     async function handleSubmit(e) {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         const formData = new FormData(e.currentTarget);

//         const res = await signIn('credentials', {
//             email: formData.get('email'),
//             password: formData.get('password'),
//             callbackUrl: '/dashboard',
//         });

//         setLoading(false);

//         if (res?.error) {
//             setError('Invalid email or password');
//             return;
//         }

//         // router.push('/dashboard');
//     }

//     return (
//         <div className="max-w-md mx-auto mt-10">
//             <h1 className="text-2xl font-bold mb-4">Login</h1>

//             {error && <p className="mb-4 text-red-500">{error}</p>}

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                     name="email"
//                     type="email"
//                     placeholder="Email"
//                     required
//                     className="w-full border p-2"
//                 />

//                 <input
//                     name="password"
//                     type="password"
//                     placeholder="Password"
//                     required
//                     className="w-full border p-2"
//                 />

//                 <button
//                     disabled={loading}
//                     className="w-full bg-black text-white p-2 disabled:opacity-60"
//                 >
//                     {loading ? <div className='flex gap-2 justify-center items-center'><Loader2 className='animate-spin' /><span>wait</span></div> : 'Login'}
//                 </button>

//             </form>

//             <hr className="my-6" />

//             <div className='flex justify-between items-center'>
//                 <Link href="/forgot-password">Forgot Password?</Link>
//                 <Link href="/register">Register</Link>
//             </div>

//             <hr className="my-6" />

//             <button
//                 onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
//                 className="w-full border p-2 mb-3"
//             >
//                 Continue with Google
//             </button>

//         </div>
//     );
// }


'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        // Sign in using credentials
        const res = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false, // important to handle errors manually
        });

        setLoading(false);

        if (res?.error) {
            // Show friendly message if Google-only account
            if (res.error.includes('Google')) {
                setError(
                    'This account uses Google login. Please click "Continue with Google".'
                );
            } else {
                setError('Invalid email or password');
            }
            return;
        }

        // Redirect manually after successful login
        if (res?.ok) {
            window.location.href = '/dashboard';
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

            {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full border p-2 rounded"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full border p-2 rounded"
                />

                <button
                    disabled={loading}
                    className="w-full bg-black text-white p-2 rounded disabled:opacity-60"
                >
                    {loading ? (
                        <div className="flex gap-2 justify-center items-center">
                            <Loader2 className="animate-spin" />
                            <span>wait</span>
                        </div>
                    ) : (
                        'Login'
                    )}
                </button>
            </form>

            <hr className="my-6" />

            <div className="flex justify-between items-center mb-4">
                <Link href="/forgot-password" className="text-blue-500">
                    Forgot Password
                </Link>
                <Link href="/register" className="text-blue-500">
                    Register
                </Link>
            </div>

            <hr className="my-6" />

            <button
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="w-full border p-2 rounded bg-white hover:bg-gray-100"
            >
                Continue with Google
            </button>
        </div>
    );
}
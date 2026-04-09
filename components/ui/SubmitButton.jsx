'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function SubmitButton({ children, subscribed, count }) {
    const { pending } = useFormStatus();
    const [loading, setLoading] = useState(false);
    const FREE_LIMIT = Number(process.env.NEXT_PUBLIC_FREE_TIER_USAGE);

    const isBlocked = !subscribed && count >= FREE_LIMIT;

    if (isBlocked) {
        return (
            <Link href="/membership" className="w-full">
                <button
                    type="button"
                    onClick={() => setLoading(true)}
                    className="w-full bg-black text-white p-2"
                >

                    {loading ? <div className='flex gap-2 justify-center items-center'><Loader2 animate-spin /><span>Wait..</span></div> : "Subscribe"}
                </button>
            </Link>
        );
    }

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-black text-white p-2 flex items-center justify-center gap-2 disabled:opacity-60"
        >
            {pending && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {children}
        </button>
    );
}

// 'use client';

// import Link from 'next/link';
// import { useFormStatus } from 'react-dom';

// export default function SubmitButton({ children, subscribed, count }) {
//     const { pending } = useFormStatus();
//     const FREE_LIMIT = Number(process.env.NEXT_PUBLIC_FREE_TIER_USAGE);
//     return (
//         <button
//             type="submit"
//             disabled={pending || (!subscribed && count >= FREE_LIMIT)}
//             className="w-full bg-black text-white p-2 flex items-center justify-center gap-2 disabled:opacity-60"
//         >
//             {pending && (
//                 <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//             )}
//             {subscribed || count < FREE_LIMIT
//                 ? "Generate Content"
//                 : <Link href="/membership">Subscribe</Link>}
//         </button>
//     );
// }


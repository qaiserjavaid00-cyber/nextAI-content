'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ThemeToggle } from '../theme-toggle';
import { LogOutIcon } from 'lucide-react';
import { useUsage } from '@/context/usage';

export default function TopNav() {
    const { data: session, status } = useSession();
    const { subscribed, loading } = useUsage();
    const isSignedIn = status === 'authenticated';
    const user = session?.user;

    return (
        <nav className="flex justify-between items-center p-2 shadow">

            <Link href="/">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={100}
                    height={50}
                    className="cursor-pointer"
                />
            </Link>

            {loading ? "" : (!subscribed && (
                <Link href="/membership">
                    🔥 Join free or $9.99/month
                </Link>
            ))
            }

            <Link href="/">Gen AI</Link>

            <div className="flex items-center">
                {isSignedIn && (
                    <Link href="/dashboard" className="mr-2">
                        {user?.name}&apos;s Dashboard
                    </Link>
                )}

                {!isSignedIn && (

                    // onClick={() => signIn()}

                    <Link href="/login" className="mr-2 px-3 py-1 border rounded"
                    >Sign in</Link>

                )}

                {isSignedIn && (
                    <button
                        onClick={() => signOut()}
                        className="mr-2 px-3 py-1 border rounded"
                    >
                        <LogOutIcon />
                    </button>
                )}

                <div className="ml-2">
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}

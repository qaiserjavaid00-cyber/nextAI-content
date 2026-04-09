import ResetPassword from '@/components/custom/RestPassword'
import React from 'react'

export default function Page({ searchParams }) {
    const token = searchParams.token;

    if (!token) {
        return <p>Invalid reset link</p>;
    }

    return <ResetPassword token={token} />;
}
import { getUserById } from '@/app/actions/password';
import ForgotPasswordForm from '@/components/custom/forgot-password-form'
import Profile from '@/components/custom/profile'
import { authOptions } from '@/utls/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react'

const SettingsPage = async () => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">You must be logged in.</p>
            </div>
        );
    }

    const dbUser = await getUserById(session?.user?.id);

    return (
        <Profile user={dbUser} />
    )
}

export default SettingsPage
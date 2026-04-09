"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Usage from "./usage";
import { useUsage } from "@/context/usage";
import EditProfileModal from "./edit-profiel-modal";
import ChangePasswordModal from "./change-password-modal";

export default function Profile({ user }) {
    const { subscribed } = useUsage();
    const [currentUser, setCurrentUser] = useState(user);

    return (
        <div className="min-h-screen p-6 flex justify-center">
            <div className="w-full max-w-3xl space-y-6">

                {/* Header with avatar */}
                <div className="relative">
                    <div className="bg-gradient-to-tr from-orange-300 via-orange-400 to-orange-600 h-32 rounded-t-2xl"></div>

                    <div className="absolute -bottom-12 left-6">
                        <Image
                            src={
                                currentUser?.image ||
                                `https://ui-avatars.com/api/?name=${currentUser?.name || "User"}&background=FB923C&color=fff`
                            }
                            alt="User"
                            width={96}
                            height={96}
                            className="rounded-full border-4 border-white dark:border-gray-800"
                        />
                    </div>
                </div>

                {/* User Info Card */}
                <Card className="pt-16">
                    <CardContent className="space-y-4">

                        {/* Top section */}
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl">
                                    {currentUser?.name || "No Name"}
                                </CardTitle>
                                <CardDescription>{currentUser.email}</CardDescription>
                            </div>

                            {/* ✅ Modal handles button internally */}
                            <div className="flex gap-2">
                                <EditProfileModal user={currentUser} setUser={setCurrentUser} />
                                <ChangePasswordModal userId={currentUser.id} />
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <Card className="bg-gray-50 dark:bg-gray-800 p-4">
                                <CardDescription className="text-sm text-gray-500">
                                    User ID
                                </CardDescription>
                                <p className="font-medium text-gray-800 break-all dark:text-gray-200">
                                    {currentUser?.id || "N/A"}
                                </p>
                            </Card>

                            <Card className="bg-gray-50 dark:bg-gray-800 p-4">
                                <CardDescription className="text-sm text-gray-500">
                                    Plan
                                </CardDescription>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                    {subscribed ? "Monthly" : "Free Tier"}
                                </p>
                            </Card>
                        </div>

                        {/* Usage Section */}
                        <Card className="bg-gray-50 dark:bg-gray-800 p-4">
                            <CardDescription className="text-sm text-gray-500 mb-2">
                                API Usage
                            </CardDescription>
                            <Usage />
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button className="bg-red-500 hover:bg-red-600 text-white">
                                Logout
                            </Button>
                            <Button variant="outline">Delete Account</Button>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { createCheckoutSession } from "@/app/actions/stripe";
import { useUsage } from "@/context/usage";


export default function PlanCard({
    name,
    image,
}) {
    // state
    const [loading, setLoading] = React.useState(false);
    const { subscribed } = useUsage();
    // hook

    const { status } = useSession()
    const isLoaded = status !== "loading";
    const isSignedIn = status === 'authenticated';

    const router = useRouter();

    const handleCheckout = async () => {
        if (name == "Free") {
            router.push("/dashboard");
            return;
        } else {

            if (subscribed) {
                toast.error("already subscribed");
                return;
            }
            setLoading(true);
            try {
                const response = await createCheckoutSession();
                const { url, error } = response;

                if (error) {
                    toast.error(error);
                    return;
                }

                if (url) {
                    window.location.href = url;
                }
            } catch (err) {
                toast.error("An unexpected error occurred. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 border">
            <Image
                width={100}
                height={100}
                className="m-5"
                src={image}
                alt="monthly membership"
            />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{name} Membership</div>
                <p className="text-gray-700 dark:text-gray-300 text-base">
                    Enjoy{" "}
                    {name == "Free"
                        ? "Limited AI generated content forever for just $0.00/month"
                        : "Unlimited AI generated content forever for just $9.99/month"}
                </p>
                <ul className="m-5">
                    <li>✨ {name == "Free" ? "Limited" : "Unlimited"} word generation</li>
                    <li>🧠 Advanced AI features</li>
                    <li>⚡ Faster processing times</li>
                    <li>🛠️ {name == "Free" ? "" : "Priority"} customer support</li>
                </ul>
            </div>

            {loading ? (
                <div className="px-5 pb-10">
                    <Button disabled={loading}>
                        <Loader2Icon className="animate-spin mr-2" /> Processing
                    </Button>
                </div>
            ) : !isLoaded ? (
                ""
            ) : !isSignedIn ? (
                <div className="px-5 pb-10">
                    <Link href="/login">
                        sign In
                    </Link>
                </div>
            ) : (
                <div className="px-5 pb-10">
                    <Button onClick={handleCheckout}>Get Started</Button>
                </div>
            )}
        </div>
    );
}

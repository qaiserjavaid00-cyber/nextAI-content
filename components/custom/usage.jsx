// "use client";
// import React from "react";
// import { useUsage } from "@/context/usage";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { createCustomerPortalSession } from "@/app/actions/stripe";
// import { Loader2 } from "lucide-react";

// export default function Usage() {
//     const { count, subscribed, expiresAt, loading } = useUsage();

//     const credits = Number(process.env.NEXT_PUBLIC_FREE_TIER_USAGE);
//     // const percentage = (count / credits) * 100;
//     const percentage = Math.min((count / credits) * 100, 100);
//     console.log("Expires At:", expiresAt)

//     if (loading) {
//         return (
//             <div className="flex justify-center p-4">
//                 <Loader2 className="animate-spin" />
//             </div>
//         );
//     }

//     return (
//         <div className="m-2">
//             <div className="rounded-lg shadow border p-2">
//                 <h2 className="font-medium">Credits</h2>

//                 <div className="h-2 bg-slate-500 w-full rounded-full mt-3">
//                     <div
//                         className="h-2 bg-slate-200 rounded-full"
//                         style={{ width: `${percentage}%` }}
//                     ></div>
//                 </div>

//                 {subscribed ? (
//                     <div className="flex flex-col">
//                         <span>Unlimited Credits</span>

//                         {/* {expiresAt && ( */}
//                         <span className="text-xs text-gray-500">
//                             Renews on {new Date(expiresAt).toLocaleDateString()}
//                         </span>
//                         {/* )} */}
//                     </div>
//                 ) : (
//                     `${count} / ${credits} credit used`
//                 )}
//             </div>

//             {subscribed ? (
//                 <Button
//                     className="w-full my-3"
//                     variant="secondary"
//                     onClick={async () => {
//                         const url = await createCustomerPortalSession();
//                         window.location.href = url;
//                     }}
//                 >
//                     Manage Subscription
//                 </Button>
//             ) : (
//                 <Link href="/membership">
//                     <Button className="w-full my-3" variant="secondary">
//                         Upgrade
//                     </Button>
//                 </Link>
//             )}
//         </div>
//     );
// }

"use client";
import React from "react";
import { useUsage } from "@/context/usage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createCustomerPortalSession } from "@/app/actions/stripe";
import { Loader2 } from "lucide-react";

export default function Usage() {
    const { count, subscribed, expiresAt, loading } = useUsage();
    const credits = Number(process.env.NEXT_PUBLIC_FREE_TIER_USAGE);
    const percentage = Math.min((count / credits) * 100, 100);

    if (loading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    // Determine button text and action
    let actionText = "Upgrade";
    let isStripeButton = false;

    const now = new Date();

    if (subscribed) {
        actionText = "Manage Subscription";
        isStripeButton = true; // go to Stripe portal
    } else if (expiresAt && now > new Date(expiresAt)) {
        actionText = "Renew";
        isStripeButton = true; // expired, still go to Stripe portal
    } else {
        actionText = "Upgrade";
        isStripeButton = false; // never subscribed, go to membership
    }

    const handleStripeClick = async () => {
        const url = await createCustomerPortalSession();
        if (url) window.location.href = url;
    };

    return (
        <div className="m-2">
            <div className="rounded-lg shadow border p-2">
                <h2 className="font-medium">Credits</h2>
                <div className="h-2 bg-slate-500 w-full rounded-full mt-3">
                    <div
                        className="h-2 bg-slate-200 rounded-full"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                {subscribed ? (
                    <div className="flex flex-col">
                        <span>Unlimited Credits</span>
                        {expiresAt && (
                            <span className="text-xs text-gray-500">
                                Renews on {new Date(expiresAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                ) : (
                    `${count} / ${credits} credit used`
                )}
            </div>

            {isStripeButton ? (
                <Button
                    className="w-full my-3"
                    variant="secondary"
                    onClick={handleStripeClick}
                >
                    {actionText}
                </Button>
            ) : (
                <Link href="/membership">
                    <Button className="w-full my-3" variant="secondary">
                        {actionText}
                    </Button>
                </Link>
            )}
        </div>
    );
}
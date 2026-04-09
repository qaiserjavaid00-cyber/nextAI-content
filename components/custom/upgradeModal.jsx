// import React from "react";
// import { useUsage } from "@/context/usage";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function UpgradeModal() {
//     const { openModal, setOpenModal } = useUsage();
//     return (
//         <Dialog
//             open={openModal}
//             onOpenChange={() =>
//                 openModal ? setOpenModal(!openModal) : setOpenModal(openModal)
//             }
//         >
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>🚀 Unlock unlimited AI-Powered content!</DialogTitle>
//                     <br />
//                     <DialogDescription>
//                         <p>
//                             🎉 Congrats! You have generated 10,000 words with our AI tool.
//                             That's amazing!{" "}
//                         </p>
//                         <p>
//                             🔒 Ready to take your content creation to the next level? Upgrade
//                             to a paid plan and enjoy!
//                         </p>
//                         <ul className="m-5">
//                             <li>✨ Unlimited word generation</li>
//                             <li>🧠 Advanced AI features</li>
//                             <li>⚡ Faster processing times</li>
//                             <li>🛠️ Priority customer support</li>
//                         </ul>
//                         <p>
//                             💡 Don't let your creativity hit a wall. Upgrade now and keep the
//                             ideas flowing!
//                         </p>

//                         <div className="m-5 text-center">
//                             <Link href="/membership">
//                                 <Button>Join Membership</Button>
//                             </Link>
//                         </div>
//                     </DialogDescription>
//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>
//     );
// }

import React from "react";
import { useUsage } from "@/context/usage";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UpgradeModal() {
    const { openModal, setOpenModal } = useUsage();

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-green-400 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            🚀 Upgrade to Pro
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm opacity-90 mt-2">
                        Unlock the full power of AI content generation
                    </p>
                </div>

                <DialogDescription asChild>
                    <div className="p-6 space-y-5">
                        {/* Usage message */}
                        <p className="text-gray-700">
                            🎉 You've reached your free limit. Time to level up your content game!
                        </p>

                        {/* Features */}
                        <ul className="space-y-2">
                            {[
                                "Unlimited word generation",
                                "Advanced AI tools",
                                "Faster generation speed",
                                "Priority support",
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-2 text-gray-800"
                                >
                                    <span className="text-green-500">✔</span> {item}
                                </motion.li>
                            ))}
                        </ul>

                        {/* Pricing Card */}
                        <div className="border rounded-2xl p-5 shadow-md text-center">
                            <h3 className="text-xl font-semibold">Pro Plan</h3>
                            <p className="text-3xl font-bold my-2">$9.99/mo</p>
                            <p className="text-sm text-gray-500">Cancel anytime</p>

                            <Link href="/membership">
                                <Button className="mt-4 w-full">
                                    Upgrade Now
                                </Button>
                            </Link>
                        </div>

                        {/* Footer note */}
                        <p className="text-xs text-gray-400 text-center">
                            💡 Keep creating without limits. Your ideas deserve it.
                        </p>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}

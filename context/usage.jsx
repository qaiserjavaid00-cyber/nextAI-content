// "use client";
// import { createContext, useContext, useState, useEffect } from "react";
// import { usageCount } from "@/app/actions/query";
// import { useSession } from "next-auth/react";
// import { checkUserSusbcription } from "@/app/actions/stripe";

// const UsageContext = createContext(null);

// export const UsageProvider = ({ children }) => {
//     // state
//     const [count, setCount] = useState(0);
//     const [openModal, setOpenModal] = useState(false);
//     const [subscribed, setSubscribed] = useState(null);
//     const [expiresAt, setExpiresAt] = useState(null);
//     // ✅ loading states
//     const [loadingUsage, setLoadingUsage] = useState(true);
//     const [loadingSubscription, setLoadingSubscription] = useState(true)
//     // hooks
//     const { data: session } = useSession()

//     const email = session?.user?.email || "";

//     useEffect(() => {

//         if (!email) {
//             setLoadingUsage(false);
//             return;
//         }
//         fetchUsage();
//     }, [email]);

//     const fetchUsage = async () => {
//         try {
//             setLoadingUsage(true);
//             const res = await usageCount(email);
//             setCount(res);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoadingUsage(false);
//         }
//     };

//     useEffect(() => {

//         if (!email) {
//             setLoadingSubscription(false);
//             return;
//         }

//         fetchSubscription();
//     }, [email]);

//     const fetchSubscription = async () => {
//         try {
//             setLoadingSubscription(true);
//             const response = await checkUserSusbcription();
//             setSubscribed(response?.ok || false);
//             setExpiresAt(response?.expiresAt || null);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoadingSubscription(false);
//         }
//     };

//     useEffect(() => {
//         if (subscribed === null) return
//         if (!subscribed && count > Number(process.env.NEXT_PUBLIC_FREE_TIER_USAGE)
//         ) {
//             setOpenModal(true);
//         } else {
//             setOpenModal(false);
//         }
//     }, [count, subscribed]);

//     return (
//         <UsageContext.Provider
//             value={
//                 {
//                     count, setCount, fetchUsage, openModal, setOpenModal, subscribed, expiresAt,
//                     loadingUsage,
//                     loadingSubscription,
//                     loading: loadingUsage || loadingSubscription,
//                     // showUpgradeModal
//                 }}
//         >
//             {children}
//         </UsageContext.Provider>
//     );
// };

// export const useUsage = () => {
//     const context = useContext(UsageContext);
//     if (context === null) {
//         throw new Error("useUsage must be used within a UsageProvider");
//     }
//     return context;
// };

"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usageCount } from "@/app/actions/query";
import { useSession } from "next-auth/react";
import { checkUserSusbcription } from "@/app/actions/stripe";

const UsageContext = createContext(null);

export const UsageProvider = ({ children }) => {
    // state
    const [count, setCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [subscribed, setSubscribed] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [loadingUsage, setLoadingUsage] = useState(true);
    const [loadingSubscription, setLoadingSubscription] = useState(true);

    const { data: session } = useSession();
    const email = session?.user?.email || "";

    // fetchUsage wrapped in useCallback
    const fetchUsage = useCallback(async () => {
        if (!email) return;
        try {
            setLoadingUsage(true);
            const res = await usageCount(email);
            setCount(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingUsage(false);
        }
    }, [email]);

    // fetchSubscription wrapped in useCallback
    const fetchSubscription = useCallback(async () => {
        if (!email) return;
        try {
            setLoadingSubscription(true);
            const response = await checkUserSusbcription();
            setSubscribed(response?.ok || false);
            setExpiresAt(response?.expiresAt || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSubscription(false);
        }
    }, [email]);

    // run usage effect
    useEffect(() => {
        fetchUsage();
    }, [fetchUsage]);

    // run subscription effect
    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    // control modal visibility
    useEffect(() => {
        if (subscribed === null) return;

        if (!subscribed && count > Number(process.env.NEXT_PUBLIC_FREE_TIER_USAGE)) {
            setOpenModal(true);
        } else {
            setOpenModal(false);
        }
    }, [count, subscribed]);

    return (
        <UsageContext.Provider
            value={{
                count,
                setCount,
                fetchUsage,
                openModal,
                setOpenModal,
                subscribed,
                expiresAt,
                loadingUsage,
                loadingSubscription,
                loading: loadingUsage || loadingSubscription,
            }}
        >
            {children}
        </UsageContext.Provider>
    );
};

export const useUsage = () => {
    const context = useContext(UsageContext);
    if (context === null) {
        throw new Error("useUsage must be used within a UsageProvider");
    }
    return context;
};
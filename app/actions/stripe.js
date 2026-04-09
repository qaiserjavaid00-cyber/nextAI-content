"use server";
import connectDB from '@/config/database/db';
import stripe from "@/utls/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utls/authOptions";
import Transaction from '../models/transaction';


export async function createCheckoutSession() {

    const session = await getServerSession(authOptions)
    const user = session?.user
    const customerEmail = user?.email
    if (!customerEmail) {
        return { error: "User not found" };
    }

    try {
        await connectDB();

        // find the stripe customer id from database
        const existingTransaction = await Transaction.findOne({ customerEmail });
        if (existingTransaction) {
            // retrieve the customer subscription from stripe
            const subscriptions = await stripe.subscriptions.list({
                customer: existingTransaction.customerId,
                status: "all",
                limit: 1,
            });

            // check if any subscription is active
            const currentSubscription = subscriptions.data.find(
                (sub) => sub.status === "active"
            );

            if (currentSubscription) {
                return { error: "You already have an active subscription" };
            }
        }

        // create a new checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: process.env.STRIPE_MONTHLY_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            customer_email: customerEmail,
            success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
        });

        return { url: session.url ?? undefined };
    } catch (err) {
        console.error(err);
        return { error: "Error creating stripe checkout session" };
    }
}

export async function checkUserSusbcription() {

    const session = await getServerSession(authOptions);
    const user = session?.user;
    const customerEmail = user?.email;

    if (!customerEmail) {
        return { error: "User not found" };
    }
    try {
        await connectDB();
        const transaction = await Transaction.findOne({
            customerEmail,
            status: "active",
        });

        if (!transaction?.subscriptionId) {
            return { error: "You dont have have an active subscription" };
        }

        const subscription = await stripe.subscriptions.retrieve(
            transaction.subscriptionId
        );

        console.log("subscription=", subscription)

        const periodEnd =
            subscription.items?.data?.[0]?.current_period_end;

        return {
            ok: subscription.status === "active",
            status: subscription.status,
            expiresAt: periodEnd
                ? new Date(periodEnd * 1000)
                : null,
        };

    } catch (err) {
        console.error(err);
        return { error: "Error checking stripe subscription" };
    }
}

export async function createCustomerPortalSession() {

    const session = await getServerSession(authOptions)
    const user = session?.user
    const customerEmail = user?.email
    if (!customerEmail) {
        return { error: "User not found" };
    }

    try {
        await connectDB();
        const transaction = await Transaction.findOne({
            customerEmail,
        });

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: transaction.customerId,
            return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
        });

        console.log("portal session => ", portalSession);

        return portalSession.url ?? `${process.env.NEXT_PUBLIC_URL}/dashboard`;
    } catch (err) {
        console.error(err);
        return null;
    }
}

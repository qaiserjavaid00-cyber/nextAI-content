export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import connectDB from "@/config/database/db";
import Transaction from "@/app/models/transaction";
import stripe from "@/utls/stripe";

export async function POST(req) {
    await connectDB();

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers.get("stripe-signature");

    let event;

    try {
        // ✅ Read raw body
        const body = Buffer.from(await req.arrayBuffer());

        // ✅ Verify Stripe signature
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            endpointSecret
        );
    } catch (err) {
        console.error("❌ Signature verification failed:", err.message);
        return new Response("Webhook Error", { status: 400 });
    }

    try {
        switch (event.type) {

            // 🟢 FIRST TIME SUBSCRIPTION
            case "checkout.session.completed": {
                const session = event.data.object;

                console.log("✅ Checkout completed:", session.id);
                if (!session.subscription) {
                    console.error("❌ No subscription found in session");
                    break;
                }

                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription
                );

                await Transaction.create({
                    sessionId: session.id,
                    customerId: session.customer,
                    invoiceId: session.invoice,
                    subscriptionId: session.subscription,
                    mode: session.mode,
                    paymentStatus: session.payment_status,
                    customerEmail: session.customer_email,
                    amountTotal: session.amount_total,
                    status: "active", // 🔥 IMPORTANT
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                });

                break;
            }

            // 🔄 SUBSCRIPTION RENEWED (monthly payment success)
            case "invoice.payment_succeeded": {
                const invoice = event.data.object;

                console.log("💰 Payment succeeded:", invoice.id);

                if (!invoice.subscription) {
                    console.error("❌ No subscription in invoice");
                    break;
                }

                const subscription = await stripe.subscriptions.retrieve(
                    invoice.subscription
                );
                await Transaction.findOneAndUpdate(
                    { customerId: invoice.customer },
                    {
                        status: "active",
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    },
                    { sort: { createdAt: -1 } } // update latest record
                );

                break;
            }

            // 🔴 PAYMENT FAILED
            case "invoice.payment_failed": {
                const invoice = event.data.object;

                console.log("❌ Payment failed:", invoice.id);

                await Transaction.findOneAndUpdate(
                    { customerId: invoice.customer },
                    { status: "past_due" },
                    { sort: { createdAt: -1 } }
                );

                break;
            }

            // ❌ SUBSCRIPTION CANCELED / EXPIRED
            case "customer.subscription.deleted": {
                const sub = event.data.object;

                console.log("🚫 Subscription canceled:", sub.id);

                await Transaction.findOneAndUpdate(
                    { subscriptionId: sub.id },
                    { status: "canceled" }
                );

                break;
            }

            default:
                console.log(`ℹ️ Unhandled event: ${event.type}`);
        }

        // ✅ Always return 200 to Stripe
        return new Response("OK", { status: 200 });

    } catch (err) {
        console.error("❌ Webhook handler error:", err);
        return new Response("Webhook handler failed", { status: 500 });
    }
}




// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// import connectDB from "@/config/database/db";
// import Transaction from "@/app/models/transaction";
// import stripe from "@/utls/stripe";

// export async function POST(req) {
//     await connectDB();

//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
//     const sig = req.headers.get("stripe-signature");

//     let event;

//     try {
//         // ✅ Read raw body ONCE
//         const body = Buffer.from(await req.arrayBuffer());

//         // ✅ Verify signature ONCE
//         event = stripe.webhooks.constructEvent(
//             body,
//             sig,
//             endpointSecret
//         );
//     } catch (err) {
//         console.error("❌ Webhook signature verification failed:", err.message);
//         return new Response("Webhook Error", { status: 400 });
//     }

//     // ✅ Handle events safely
//     try {
//         if (event.type === "checkout.session.completed") {
//             const session = event.data.object;

//             console.log("✅ STRIPE SESSION:", session.id);

//             await Transaction.create({
//                 sessionId: session.id,
//                 customerId: session.customer,
//                 invoiceId: session.invoice,
//                 subscriptionId: session.subscription,
//                 mode: session.mode,
//                 paymentStatus: session.payment_status,
//                 customerEmail: session.customer_email,
//                 amountTotal: session.amount_total,
//                 status: session.status,
//             });
//         }

//         // Always acknowledge Stripe
//         return new Response("OK", { status: 200 });
//     } catch (err) {
//         console.error("❌ Webhook handler error:", err);
//         return new Response("Webhook handler failed", { status: 500 });
//     }
// }



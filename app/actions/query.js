"use server";

import connectDB from "@/config/database/db";
import Query from "@/app/models/query";
import { generateAIText } from "@/lib/ai";
import templates from "@/utls/templates";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utls/authOptions";
import { checkUserSusbcription } from "./stripe";
import { Types } from "mongoose";

async function getUserEmail() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("Unauthorized");
    }
    return session.user.email;
}

export async function getQueries(page = 1, pageSize = 10) {
    try {
        await connectDB();

        const email = await getUserEmail();

        const skip = (page - 1) * pageSize;
        const totalQueries = await Query.countDocuments({ email });

        let queries = await Query.find({ email })
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .lean();

        // Convert fields to fully serializable plain objects
        queries = queries.map(q => ({
            ...q,
            _id: q._id.toString(),
            createdAt: q.createdAt.toISOString(),
            updatedAt: q.updatedAt.toISOString(),
            template: {
                name: q.template.name,
                slug: q.template.slug,
                icon: q.template.icon,
            },
        }));

        return {
            queries,
            totalPages: Math.ceil(totalQueries / pageSize),
        };
    } catch (err) {
        console.error(err);
        return { ok: false };
    }
}

export async function usageCount(email) {
    await connectDB();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const result = await Query.aggregate([
        {
            $match: {
                email,
                createdAt: {
                    $gte: new Date(currentYear, currentMonth - 1, 1),
                    $lt: new Date(currentYear, currentMonth, 1),
                },
            },
        },
        {
            $group: {
                _id: null,
                totalWords: { $sum: "$wordCount" },
            },
        },
    ]);

    return result[0]?.totalWords || 0;
}

// export async function usageCount(email) {
//     await connectDB();
//     // const email = await getUserEmail();
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth() + 1;

//     const result = await Query.aggregate([
//         {
//             $match: {
//                 email: email,
//                 $expr: {
//                     $and: [
//                         { $eq: [{ $year: "$createdAt" }, currentYear] },
//                         { $eq: [{ $month: "$createdAt" }, currentMonth] },
//                     ],
//                 },
//             },
//         },
//         {
//             $project: {
//                 wordCount: {
//                     // Use a JS function in MongoDB aggregation to strip HTML and count words
//                     $function: {
//                         body: function (content) {
//                             if (!content) return 0;
//                             // Remove all HTML tags
//                             const plainText = content.replace(/<[^>]*>/g, " ");
//                             // Split by whitespace
//                             return plainText.trim().split(/\s+/).filter(Boolean).length;
//                         },
//                         args: ["$content"],
//                         lang: "js",
//                     },
//                 },
//             },
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalWords: { $sum: "$wordCount" },
//             },
//         },
//     ]);

//     console.log("usage count =", result.length);
//     return result.length > 0 ? result[0].totalWords : 0;
// }

// export async function usageCount() {
//     await connectDB();

//     const email = await getUserEmail();
//     console.log("user email from usage count", email)
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth() + 1;

//     const result = await Query.aggregate([
//         {
//             $match: {
//                 email: email,
//                 $expr: {
//                     $and: [
//                         { $eq: [{ $year: "$createdAt" }, currentYear] },
//                         { $eq: [{ $month: "$createdAt" }, currentMonth] },
//                     ],
//                 },
//             },
//         },
//         {
//             $project: {
//                 wordCount: {
//                     $size: {
//                         $split: [{ $trim: { input: "$content" } }, " "],
//                     },
//                 },
//             },
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalWords: { $sum: "$wordCount" },
//             },
//         },
//     ]);
//     console.log("usage count=", result.length)
//     return result.length > 0 ? result[0].totalWords : 0;
// }


export async function generateAndSave(prevState, formData) {
    try {
        await connectDB();
        const email = await getUserEmail();
        const usage = await usageCount(email)
        const sub = await checkUserSusbcription();

        const FREE_LIMIT = Number(process.env.NEXT_PUBLIC_FREE_TIER_USAGE);

        if (!sub.ok && usage >= FREE_LIMIT) {
            throw new Error("Upgrade required");
        }
        const templateSlug = formData.get("templateSlug");
        // const email = formData.get("email");

        const template = templates.find(t => t.slug === templateSlug);
        if (!template) throw new Error("Invalid template");

        // Get the first input field's name dynamically
        const firstFieldName = template.form[0].name;
        const query = formData.get(firstFieldName);

        if (!query) {
            throw new Error(`Missing required field: ${firstFieldName}`);
        }

        // Generate AI content
        const content = await generateAIText(query);
        const plainText = content.replace(/<[^>]*>/g, " ");
        const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
        // Save to DB
        await Query.create({
            template,
            email,
            query,
            content,
            wordCount
        });

        return { result: content, error: null };
    } catch (err) {
        console.error(err);
        return { result: null, error: err.message || "Failed to generate content" };
    }
}


export const getQueryById = async (id) => {
    const email = await getUserEmail();
    try {
        // ✅ validate id (important)
        if (!id || !Types.ObjectId.isValid(id)) {
            return null;
        }

        await connectDB();

        const query = await Query.findById(id).lean();

        if (!query) {
            return null;
        }

        // ✅ serialize _id for Next.js
        return {
            ...query,
            _id: query._id.toString(),
        };
    } catch (error) {
        console.error("getQueryById error:", error);
        return null;
    }
};


export const updateQuery = async ({ id, content }) => {
    const email = await getUserEmail();
    try {
        await connectDB();

        await Query.findByIdAndUpdate(id, {
            content,
        });

        return { success: true };
    } catch (error) {
        return { error: "Failed to update" };
    }
};
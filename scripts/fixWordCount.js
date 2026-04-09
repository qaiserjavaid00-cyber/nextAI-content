import "dotenv/config";

import connectDB from "../config/database/db.js";
import Query from "../app/models/query.js";

async function fixWordCount() {
    await connectDB();

    const queries = await Query.find({ wordCount: { $exists: false } });

    console.log(`Found ${queries.length} docs to update`);

    for (const q of queries) {
        const plainText = q.content?.replace(/<[^>]*>/g, " ") || "";
        const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;

        q.wordCount = wordCount;
        await q.save();
    }

    console.log("✅ Backfill complete");
    process.exit(0);
}

fixWordCount();
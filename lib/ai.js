import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export async function generateAIText(prompt) {
    const completion = await client.chat.completions.create({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
            { role: "user", content: prompt },
        ],
    });

    return completion.choices[0].message.content;
}

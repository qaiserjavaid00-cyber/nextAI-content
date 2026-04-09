'use server';

import { generateAIText } from "@/lib/ai";

export async function submitPrompt(prevState, formData) {
    console.log(formData)
    const prompt = formData.get('niche');

    if (!prompt) {
        return { error: 'Prompt must be there' };
    }
    if (prompt.trim().length < 3) {
        return { error: 'Prompt must be at least 3 characters' };
    }
    try {
        const response = await generateAIText(prompt);
        return { result: response };
    } catch (error) {
        return { error: 'AI request failed. Try again.' };
    }
}

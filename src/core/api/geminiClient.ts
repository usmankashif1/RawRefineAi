import { AI_TEXT_PARSER_PROMPT } from "../system_prompts/Ai_Text_Parser";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
// Using the fast, large-context Flash model
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface CleanTextResponse {
    summary: string;
    error?: string;
}

export const cleanAndSummarizeText = async (rawText: string): Promise<CleanTextResponse> => {
    if (!rawText.trim()) {
        return { summary: '', error: 'Please enter text to process.' };
    }

    const prompt = AI_TEXT_PARSER_PROMPT(rawText);

    try {
        const response = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.1, // Low temperature for high precision & minimal drift
                    maxOutputTokens: 5000,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error?.message || 'Failed to communicate with Gemini API');
        }

        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            throw new Error('Received an empty response from AI.');
        }

        return { summary: generatedText };
    } catch (error: any) {
        return { summary: '', error: error.message || 'An unexpected error occurred.' };
    }
};
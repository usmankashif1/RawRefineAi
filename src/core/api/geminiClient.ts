import { AI_TEXT_PARSER_PROMPT } from '../system_prompts/Ai_Text_Parser';
import { GEMINI_API_KEY } from '../utils/config';

export interface CleanTextResponse {
    summary: string;
    error?: string;
}



export const cleanAndSummarizeText = async (rawText: string): Promise<CleanTextResponse> => {
    if (!rawText.trim()) {
        return { summary: '', error: 'Please enter text to process.' };
    }
    if (!GEMINI_API_KEY) {
        return { summary: '', error: 'The summary service is not configured.' };
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: AI_TEXT_PARSER_PROMPT(rawText) }] }],
                    generationConfig: { temperature: 0.1, maxOutputTokens: 7000 },
                }),
            },
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error?.message || 'Failed to communicate with Gemini API');
        }

        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!generatedText) {
            throw new Error('Received an empty response from AI.');
        }

        return { summary: generatedText };
    } catch (error) {
        return {
            summary: '',
            error: error instanceof Error ? error.message : 'An unexpected error occurred.',
        };
    }
};

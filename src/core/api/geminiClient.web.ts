import type { CleanTextResponse } from './geminiClient';

export const cleanAndSummarizeText = async (rawText: string): Promise<CleanTextResponse> => {
    if (!rawText.trim()) {
        return { summary: '', error: 'Please enter text to process.' };
    }

    try {
        const response = await fetch('/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: rawText }),
        });
        const data = await response.json();

        if (!response.ok) {
            return {
                summary: '',
                error: data?.error || 'Failed to create a summary.',
            };
        }

        if (typeof data?.summary !== 'string' || !data.summary.trim()) {
            return { summary: '', error: 'The summary service returned an empty response.' };
        }

        return { summary: data.summary };
    } catch {
        return {
            summary: '',
            error: 'Could not reach the summary service. Please try again.',
        };
    }
};

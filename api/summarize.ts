import { AI_TEXT_PARSER_PROMPT } from '../src/core/system_prompts/Ai_Text_Parser';
import { GEMINI_API_KEY } from '../src/core/utils/config';

const GEMINI_MODEL = 'gemini-3.5-flash';
const MAX_INPUT_LENGTH = 20000;

interface SummaryRequest {
    method?: string;
    body?: {
        text?: unknown;
    };
}

interface SummaryResponse {
    setHeader(name: string, value: string): void;
    status(code: number): SummaryResponse;
    json(body: { error: string } | { summary: string }): SummaryResponse;
}

export default async function summarize(req: SummaryRequest, res: SummaryResponse): Promise<void> {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Only POST requests are supported.' });
        return;
    }

    const rawText = req.body?.text;
    if (typeof rawText !== 'string' || !rawText.trim()) {
        res.status(400).json({ error: 'Please provide text to summarize.' });
        return;
    }
    if (rawText.length > MAX_INPUT_LENGTH) {
        res.status(413).json({ error: `Text must be ${MAX_INPUT_LENGTH} characters or fewer.` });
        return;
    }
    if (!GEMINI_API_KEY) {
        console.error('EXPO_PUBLIC_GEMINI_API_KEY is not configured.');
        res.status(500).json({ error: 'The summary service is not configured.' });
        return;
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: AI_TEXT_PARSER_PROMPT(rawText) }] }],
                    generationConfig: { temperature: 0.1, maxOutputTokens: 5000 },
                }),
                signal: AbortSignal.timeout(55000),
            },
        );
        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini summary request failed:', response.status);
            res.status(502).json({ error: 'The summary service could not process this request.' });
            return;
        }

        const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof summary !== 'string' || !summary.trim()) {
            res.status(502).json({ error: 'The summary service returned an empty response.' });
            return;
        }

        res.status(200).json({ summary });
    } catch (error) {
        console.error('Gemini summary request failed:', error);
        res.status(502).json({ error: 'Could not reach the Gemini service. Please try again.' });
    }
}

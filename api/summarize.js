const { AI_TEXT_PARSER_PROMPT } = require('../src/core/system_prompts/aiTextParserPrompt');

const GEMINI_MODEL = 'gemini-3.5-flash';
const MAX_INPUT_LENGTH = 20000;

module.exports = async function summarize(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Only POST requests are supported.' });
    }

    const rawText = req.body?.text;
    if (typeof rawText !== 'string' || !rawText.trim()) {
        return res.status(400).json({ error: 'Please provide text to summarize.' });
    }
    if (rawText.length > MAX_INPUT_LENGTH) {
        return res.status(413).json({ error: `Text must be ${MAX_INPUT_LENGTH} characters or fewer.` });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not configured.');
        return res.status(500).json({ error: 'The summary service is not configured.' });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
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
            return res.status(502).json({ error: 'The summary service could not process this request.' });
        }

        const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof summary !== 'string' || !summary.trim()) {
            return res.status(502).json({ error: 'The summary service returned an empty response.' });
        }

        return res.status(200).json({ summary });
    } catch (error) {
        console.error('Gemini summary request failed:', error);
        return res.status(502).json({ error: 'Could not reach the summary service. Please try again.' });
    }
};

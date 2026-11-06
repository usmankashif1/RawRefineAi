const GROQ_AUDIO_ENDPOINT = 'https://api.groq.com/openai/v1/audio/translations';
const MAX_AUDIO_SIZE = 25 * 1024 * 1024;

interface TranscriptionRequest extends AsyncIterable<Uint8Array | string> {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
}

interface TranscriptionResponse {
    setHeader(name: string, value: string): void;
    status(code: number): TranscriptionResponse;
    json(body: { error: string } | { text: string }): TranscriptionResponse;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function transcribe(
    req: TranscriptionRequest,
    res: TranscriptionResponse,
): Promise<void> {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Only POST requests are supported.' });
        return;
    }

    const contentType = req.headers['content-type'];
    if (typeof contentType !== 'string' || !contentType.startsWith('multipart/form-data;')) {
        res.status(400).json({ error: 'An audio file upload is required.' });
        return;
    }

    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
        console.error('EXPO_PUBLIC_GROQ_API_KEY is not configured.');
        res.status(500).json({ error: 'The transcription service is not configured.' });
        return;
    }

    const chunks: Uint8Array[] = [];
    let totalSize = 0;
    for await (const chunk of req) {
        const bytes = typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk;
        totalSize += bytes.byteLength;
        if (totalSize > MAX_AUDIO_SIZE) {
            res.status(413).json({ error: 'Audio file must be 25 MB or smaller.' });
            return;
        }
        chunks.push(bytes);
    }

    if (totalSize === 0) {
        res.status(400).json({ error: 'The audio upload is empty.' });
        return;
    }

    const body = new Uint8Array(totalSize);
    let offset = 0;
    for (const chunk of chunks) {
        body.set(chunk, offset);
        offset += chunk.byteLength;
    }

    try {
        const response = await fetch(GROQ_AUDIO_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': contentType,
            },
            body: new Blob([body], { type: contentType }),
            signal: AbortSignal.timeout(55000),
        });
        const data = await response.json();

        if (!response.ok) {
            console.error('Groq transcription request failed:', response.status);
            res.status(502).json({ error: 'The transcription service could not process this audio.' });
            return;
        }

        if (typeof data?.text !== 'string') {
            res.status(502).json({ error: 'The transcription service returned an invalid response.' });
            return;
        }

        res.status(200).json({ text: data.text });
    } catch (error) {
        console.error('Groq transcription request failed:', error);
        res.status(502).json({ error: 'Could not reach the transcription service. Please try again.' });
    }
}

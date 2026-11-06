import { Platform } from 'react-native';
import { API_BASE_URL } from '../utils/config';

const TRANSCRIPTION_ENDPOINT = Platform.OS === 'web'
    ? '/api/transcribe'
    : `${API_BASE_URL.replace(/\/+$/, '')}/api/transcribe`;

export const transcribeAudioWithGroq = async (audioUri: string): Promise<string> => {
    try {
        if (Platform.OS !== 'web' && API_BASE_URL === 'https://api.example.com') {
            throw new Error('Set EXPO_PUBLIC_API_URL to your Vercel deployment URL.');
        }

        const formData = new FormData();

        if (Platform.OS === 'web') {
            const audioResponse = await fetch(audioUri);
            if (!audioResponse.ok) {
                throw new Error(`Could not load the audio recording (HTTP ${audioResponse.status}).`);
            }

            const audioBlob = await audioResponse.blob();
            if (audioBlob.size === 0) {
                throw new Error('The audio recording is empty.');
            }

            const mimeType = audioBlob.type || 'audio/webm';
            const extension = mimeType.includes('mp4')
                ? 'm4a'
                : mimeType.includes('ogg')
                    ? 'ogg'
                    : 'webm';
            formData.append('file', audioBlob, `recording.${extension}`);
        } else {
            formData.append('file', {
                uri: audioUri,
                name: 'recording.m4a',
                type: 'audio/m4a',
            } as any);
        }

        formData.append('model', 'whisper-large-v3');
        formData.append('response_format', 'json');

        const response = await fetch(TRANSCRIPTION_ENDPOINT, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || 'Could not transcribe the audio recording.');
        }

        const data = await response.json();
        if (typeof data?.text !== 'string') {
            throw new Error('The transcription service returned an invalid response.');
        }
        return data.text;
    } catch (error) {
        console.error('Transcription failed:', error);
        throw error;
    }
};

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { transcribeAudioWithGroq } from '../core/api/groqVoiceService';

interface VoiceInputProps {
    onTranscriptionComplete: (text: string) => void;
}

export const VoiceInputButton: React.FC<VoiceInputProps> = ({ onTranscriptionComplete }) => {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    useEffect(() => {
        return () => {
            // Unmount cleanup: unload recording if still active
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            if (permissionResponse?.status !== 'granted') {
                const permission = await requestPermission();
                if (!permission.granted) {
                    Alert.alert('Permission required', 'Microphone access is required for voice input.');
                    return;
                }
            }

            // Configure audio session for high-quality voice capture
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(newRecording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Could not access microphone.');
        }
    };

    
    const stopAndTranscribe = async () => {
        if (!recording) return;

        try {
            setIsRecording(false);
            setIsTranscribing(true);

            // Stop continuous local recording
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            // Reset audio category
            await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

            if (uri) {
                // Send file to Groq Cloud Whisper API
                const transcribedText = await transcribeAudioWithGroq(uri);
                onTranscriptionComplete(transcribedText);
            }
        } catch (error) {
            Alert.alert('Transcription Failed', 'Unable to process voice input. Please try again.');
        } finally {
            setIsTranscribing(false);
        }
    };

    return (
        <View style={styles.container}>
            {isTranscribing ? (
                <View style={styles.statusContainer}>
                    <ActivityIndicator size="small" color="#8A591E" />
                    <Text style={styles.statusText}>Translating speech to English...</Text>
                </View>
            ) : isRecording ? (
                <TouchableOpacity
                    style={[styles.button, styles.recordingActive]}
                    onPress={stopAndTranscribe}
                    accessibilityRole="button"
                    accessibilityLabel="Stop recording and transcribe"
                >
                    <View style={styles.recordingPulse} />
                    <Text style={styles.buttonText}>Stop recording</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.button}
                    onPress={startRecording}
                    accessibilityRole="button"
                    accessibilityLabel="Start voice recording"
                >
                    <Text style={styles.buttonText}>🎤 Speak</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    button: {
        minHeight: 44,
        flexDirection: 'row',
        backgroundColor: '#8A591E',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    recordingActive: {
        backgroundColor: '#EF4444',
    },
    recordingPulse: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFF',
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusText: {
        color: '#6B7280',
        fontSize: 14,
    },
});
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { cleanAndSummarizeText } from '../../../core/api/geminiClient';
import { showErrorToast } from '../../../core/utils/toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandLogo from '../../../components/BrandLogo';

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const HomeScreen = () => {
    const { width } = useWindowDimensions();
    const isWideScreen = width >= 820;
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const inputWordCount = countWords(inputText);
    const resultWordCount = countWords(result);

    const handleProcessText = async () => {
        if (!inputText.trim()) return;

        setLoading(true);
        setError('');
        setResult('');
        setCopied(false);

        try {
            const res = await cleanAndSummarizeText(inputText);
            if (res.error) {
                setError(res.error);
            } else {
                setResult(res.summary);
            }
        } catch {
            setError('Something went wrong while processing your text. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopySummary = async () => {
        try {
            await Clipboard.setStringAsync(result);
            setCopied(true);
        } catch {
            showErrorToast('Could not copy summary', 'Please select and copy the summary manually.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        isWideScreen && styles.wideScrollContent,
                    ]}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.page}>
                        <BrandLogo />
                        <View style={styles.intro}>
                            <Text style={[styles.title, isWideScreen && styles.wideTitle]}>
                                Clear updates,{"\n"}
                                <Text style={styles.titleAccent}>less busywork.</Text>
                            </Text>
                            <Text style={styles.subtitle}>
                                Turn meeting notes, task status, and rough drafts into clear team updates.
                            </Text>
                        </View>

                        <View style={[styles.workspace, isWideScreen && styles.wideWorkspace]}>
                            <View style={styles.panel}>
                                <View style={styles.panelHeader}>
                                    <View>
                                        <Text style={styles.panelTitle}>Draft update</Text>
                                        <Text style={styles.panelHint}>Paste notes or write a first draft</Text>
                                    </View>
                                </View>

                                <TextInput
                                    style={[styles.textArea, isWideScreen && styles.wideTextArea]}
                                    placeholder="Add meeting notes, progress, blockers, or next steps..."
                                    placeholderTextColor="#626B7D"
                                    multiline
                                    textAlignVertical="top"
                                    value={inputText}
                                    onChangeText={text => {
                                        setInputText(text);
                                        setCopied(false);
                                    }}
                                    accessibilityLabel="Draft a work update"
                                />

                                <View style={styles.inputFooter}>
                                    <Text style={styles.wordCount}>
                                        {inputWordCount} {inputWordCount === 1 ? 'word' : 'words'}
                                    </Text>
                                    {inputText.length > 0 ? (
                                        <TouchableOpacity
                                            style={styles.clearButton}
                                            onPress={() => {
                                                setInputText('');
                                                setResult('');
                                                setError('');
                                                setCopied(false);
                                            }}
                                            accessibilityRole="button"
                                            accessibilityLabel="Clear draft"
                                        >
                                            <Text style={styles.clearButtonText}>Clear draft</Text>
                                        </TouchableOpacity>
                                    ) : null}
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            (!inputText.trim() || loading) && styles.buttonDisabled,
                                        ]}
                                        onPress={handleProcessText}
                                        disabled={!inputText.trim() || loading}
                                        accessibilityRole="button"
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.buttonText}>Create summary</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                            </View>

                            <View style={[styles.panel, styles.outputPanel]}>
                                <View style={styles.panelHeader}>
                                    <View>
                                        <Text style={styles.panelTitle}>Team-ready summary</Text>
                                        <Text style={styles.panelHint}>Review before sharing with your team</Text>
                                    </View>
                                    {result ? (
                                        <TouchableOpacity
                                            style={styles.copyButton}
                                            onPress={handleCopySummary}
                                            accessibilityRole="button"
                                            accessibilityLabel={copied ? 'Summary copied to clipboard' : 'Copy summary to clipboard'}
                                        >
                                            <Text style={styles.copyButtonText}>{copied ? 'Copied' : 'Copy'}</Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>

                                {result ? (
                                    <View style={styles.resultContent}>
                                        <Text style={styles.resultText}>{result}</Text>
                                        <Text style={styles.resultWordCount}>
                                            {resultWordCount} {resultWordCount === 1 ? 'word' : 'words'}
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={[styles.emptyState, isWideScreen && styles.wideEmptyState]}>
                                        <Text style={styles.emptyTitle}>Your summary will appear here</Text>
                                        <Text style={styles.emptyDescription}>
                                            Key decisions, progress, and next steps will be easier to scan.
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <Text style={styles.privacyNote}>
                            Your text is sent to AI to create a summary. Don’t include confidential information.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 28,
    },
    wideScrollContent: {
        paddingHorizontal: 32,
        paddingTop: 40,
    },
    page: {
        width: '100%',
        maxWidth: 1160,
    },
    intro: {
        marginBottom: 24,
    },
    title: {
        color: '#20243A',
        fontSize: 32,
        fontWeight: '800',
        lineHeight: 38,
        letterSpacing: -0.7,
        marginBottom: 8,
    },
    wideTitle: {
        fontSize: 40,
        lineHeight: 46,
    },
    titleAccent: {
        color: '#8A591E',
    },
    subtitle: {
        maxWidth: 520,
        color: '#4F586B',
        fontSize: 15,
        lineHeight: 22,
    },
    workspace: {
        flexDirection: 'column',
        gap: 16,
    },
    wideWorkspace: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 20,
    },
    panel: {
        flex: 1,
        minWidth: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D8DCE5',
        padding: 18,
    },
    outputPanel: {
        backgroundColor: '#FAFBFC',
    },
    panelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    panelTitle: {
        color: '#252A40',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 3,
    },
    panelHint: {
        color: '#535D70',
        fontSize: 14,
        lineHeight: 19,
    },
    copyButton: {
        minHeight: 44,
        minWidth: 64,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#D5B98F',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginLeft: 12,
    },
    copyButtonText: {
        color: '#754B1C',
        fontSize: 14,
        fontWeight: '600',
    },
    textArea: {
        width: '100%',
        minHeight: 180,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#C8CDD8',
        padding: 14,
        color: '#252A40',
        fontSize: 16,
        lineHeight: 24,
    },
    wideTextArea: {
        minHeight: 230,
    },
    inputFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginTop: 14,
    },
    wordCount: {
        flex: 1,
        color: '#535D70',
        fontSize: 14,
    },
    clearButton: {
        minHeight: 44,
        minWidth: 44,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    clearButtonText: {
        color: '#754B1C',
        fontSize: 14,
        fontWeight: '600',
    },
    button: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8A591E',
        borderRadius: 8,
        paddingHorizontal: 16,
    },
    buttonDisabled: {
        backgroundColor: '#716B62',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    errorText: {
        color: '#A12E2E',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 10,
    },
    emptyState: {
        minHeight: 180,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E3E9',
    },
    wideEmptyState: {
        flex: 1,
        minHeight: 230,
    },
    emptyTitle: {
        color: '#353B4D',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    emptyDescription: {
        maxWidth: 280,
        color: '#535D70',
        fontSize: 15,
        lineHeight: 22,
    },
    resultContent: {
        flex: 1,
        minHeight: 180,
        paddingVertical: 8,
    },
    resultText: {
        color: '#30364A',
        fontSize: 16,
        lineHeight: 25,
    },
    resultWordCount: {
        color: '#535D70',
        fontSize: 14,
        marginTop: 16,
    },
    privacyNote: {
        color: '#535D70',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 14,
    },
});

export default HomeScreen;

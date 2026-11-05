import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

const BrandLogo = () => {
    const { width } = useWindowDimensions();
    const isWideScreen = width >= 820;

    return (
        <View
            accessible
            accessibilityLabel="RawRefine AI. Raw updates, refined for your team."
            style={styles.container}
        >
            <Text style={[styles.name, isWideScreen && styles.wideName]}>
                RawRefine <Text style={styles.accent}>AI</Text>
            </Text>
            <Text style={[styles.tagline, isWideScreen && styles.wideTagline]}>
                Raw updates, refined for your team
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        marginBottom: 30,
    },
    name: {
        color: '#17191D',
        fontSize: 30,
        fontWeight: '800',
        letterSpacing: -0.8,
        lineHeight: 36,
    },
    wideName: {
        fontSize: 40,
        lineHeight: 48,
    },
    accent: {
        color: '#B9792A',
    },
    tagline: {
        color: '#53565D',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.1,
        lineHeight: 20,
        marginLeft: 2,
        marginTop: 3,
    },
    wideTagline: {
        fontSize: 16,
        lineHeight: 22,
        marginLeft: 5,
    },
});

export default BrandLogo;

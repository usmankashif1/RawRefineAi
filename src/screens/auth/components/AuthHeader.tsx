import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../../components/AppText';
import { defaultTheme } from '../../../core/theme/defaultTheme';

interface AuthHeaderProps {
    title: string;
    subtitle?: string;
}

const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
    return (
        <View style={styles.wrapper}>
            <AppText variant="h1">{title}</AppText>
            {subtitle ? (
                <AppText color={defaultTheme.colors.textSecondary} style={styles.subtitle}>
                    {subtitle}
                </AppText>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: { marginBottom: defaultTheme.spacing.lg },
    subtitle: { marginTop: defaultTheme.spacing.xs },
});

export default AuthHeader;

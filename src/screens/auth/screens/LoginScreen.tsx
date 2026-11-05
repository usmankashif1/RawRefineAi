import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import AppButton from '../../../components/AppButton';
import AppText from '../../../components/AppText';
import ScrollScreen from '../../../components/ScrollScreen';
import { defaultTheme } from '../../../core/theme/defaultTheme';
import { getErrorMessage } from '../../../core/utils/errorMessage';
import { RH } from '../../../core/utils/responsive';
import { saveToken } from '../../../core/utils/tokenStorage';
import { showErrorToast, showSuccessToast } from '../../../core/utils/toast';
import { useAppDispatch } from '../../../store/hooks';
import { setToken } from '../../../store/slices/authSlice';
import { login } from '../auth.api';
import type { LoginErrors } from '../auth.types';
import { validateLogin } from '../auth.validation';
import AuthHeader from '../components/AuthHeader';

const { colors, radius, spacing } = defaultTheme;

const LoginScreen = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<LoginErrors>({});
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const validation = validateLogin({ email, password });
        setErrors(validation);
        if (Object.keys(validation).length > 0) return;

        try {
            setLoading(true);
            const { token } = await login({ email: email.trim(), password });
            await saveToken(token);
            dispatch(setToken(token));
            showSuccessToast('Welcome back');
        } catch (error) {
            showErrorToast('Login failed', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollScreen contentContainerStyle={styles.content}>
            <AuthHeader title="Sign in" subtitle="Enter your credentials to continue" />

            <View style={styles.field}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                {errors.email ? <AppText variant="caption" color={colors.error}>{errors.email}</AppText> : null}
            </View>

            <View style={styles.field}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {errors.password ? <AppText variant="caption" color={colors.error}>{errors.password}</AppText> : null}
            </View>

            <AppButton title="Sign in" onPress={handleLogin} loading={loading} />
        </ScrollScreen>
    );
};

const styles = StyleSheet.create({
    content: { justifyContent: 'center' },
    field: { marginBottom: spacing.md, gap: spacing.xs },
    input: {
        height: RH(50),
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        color: colors.text,
    },
});

export default LoginScreen;

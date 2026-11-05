import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../../components/AppText';
import { defaultTheme } from '../../../core/theme/defaultTheme';
import { RW } from '../../../core/utils/responsive';
import type { UserProfile } from '../profile.types';

const AVATAR = RW(64);

const ProfileHeader = ({ profile }: { profile: UserProfile }) => {
    return (
        <View style={styles.row}>
            <View style={styles.avatar}>
                <AppText variant="h2" color={defaultTheme.colors.primaryText}>
                    {profile.name.charAt(0).toUpperCase()}
                </AppText>
            </View>
            <View style={styles.info}>
                <AppText variant="title">{profile.name}</AppText>
                <AppText variant="caption" color={defaultTheme.colors.textSecondary}>
                    {profile.email}
                </AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: defaultTheme.spacing.md },
    avatar: {
        width: AVATAR,
        height: AVATAR,
        borderRadius: AVATAR / 2,
        backgroundColor: defaultTheme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: { gap: defaultTheme.spacing.xs },
});

export default ProfileHeader;

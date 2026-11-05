import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppButton from '../../../components/AppButton';
import AppHeader from '../../../components/AppHeader';
import Screen from '../../../components/Screen';
import { defaultTheme } from '../../../core/theme/defaultTheme';
import { getErrorMessage } from '../../../core/utils/errorMessage';
import { removeToken } from '../../../core/utils/tokenStorage';
import { showErrorToast } from '../../../core/utils/toast';
import { useAppDispatch } from '../../../store/hooks';
import { logout } from '../../../store/slices/authSlice';
import ProfileHeader from '../components/ProfileHeader';
import ProfileHeaderSkeleton from '../components/ProfileHeaderSkeleton';
import { fetchProfile } from '../profile.api';
import type { UserProfile } from '../profile.types';

const ProfileScreen = () => {
    const dispatch = useAppDispatch();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setProfile(await fetchProfile());
            } catch (error) {
                showErrorToast('Could not load profile', getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleLogout = async () => {
        await removeToken();
        dispatch(logout());
    };

    return (
        <Screen>
            <AppHeader title="Profile" />
            <View style={styles.body}>
                {loading ? <ProfileHeaderSkeleton /> : profile ? <ProfileHeader profile={profile} /> : null}
                <AppButton title="Log out" variant="outline" onPress={handleLogout} />
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    body: { flex: 1, padding: defaultTheme.spacing.md, gap: defaultTheme.spacing.lg },
});

export default ProfileScreen;

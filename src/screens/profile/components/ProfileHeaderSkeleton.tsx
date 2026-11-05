import React from 'react';
import { StyleSheet, View } from 'react-native';
import SkeletonBox from '../../../components/SkeletonBox';
import { defaultTheme } from '../../../core/theme/defaultTheme';
import { RH, RW } from '../../../core/utils/responsive';

const AVATAR = RW(64);

const ProfileHeaderSkeleton = () => {
    return (
        <View style={styles.row}>
            <SkeletonBox width={AVATAR} height={AVATAR} borderRadius={AVATAR / 2} />
            <View style={styles.info}>
                <SkeletonBox width={RW(140)} height={RH(18)} />
                <SkeletonBox width={RW(180)} height={RH(12)} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: defaultTheme.spacing.md },
    info: { gap: defaultTheme.spacing.sm },
});

export default ProfileHeaderSkeleton;

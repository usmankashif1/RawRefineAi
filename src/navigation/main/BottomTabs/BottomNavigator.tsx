import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { defaultTheme } from '../../../core/theme/defaultTheme';
import HomeNavigator from '../../../screens/home/navigation/HomeNavigator';
import ProfileNavigator from '../../../screens/profile/navigation/ProfileNavigator';

export type BottomTabParamList = {
    HomeTab: undefined;
    ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: defaultTheme.colors.primary,
                tabBarInactiveTintColor: defaultTheme.colors.textSecondary,
                tabBarIcon: () => null, // plug your SVG icons in here
            }}>
            <Tab.Screen name="HomeTab" component={HomeNavigator} options={{ title: 'Home' }} />
            <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ title: 'Profile' }} />
        </Tab.Navigator>
    );
};

export default BottomNavigator;

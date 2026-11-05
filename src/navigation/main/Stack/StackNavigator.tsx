import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigator from '../BottomTabs/BottomNavigator';
import HomeNavigator from '../../../screens/home/navigation/HomeNavigator';

export type MainStackParamList = {
    Tabs: undefined;
    // Add full-screen (non-tab) screens here, e.g. Details: { id: string };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="Tabs" component={BottomNavigator} /> */}
            <Stack.Screen name="HomeTab" component={HomeNavigator} options={{ title: 'Home' }} />

        </Stack.Navigator>
    );
};

export default StackNavigator;

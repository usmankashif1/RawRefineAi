import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Container from '../../components/Container';
import Screen from '../../components/Screen';
import SkeletonLoader from '../../components/SkeletonLoader';
import { getToken } from '../../core/utils/tokenStorage';
import { setToken } from '../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import AuthNavigator from '../auth/AuthNavigator';
import StackNavigator from '../main/Stack/StackNavigator';

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    const dispatch = useAppDispatch();
    const { token, isBootstrapping } = useAppSelector(state => state.auth);

    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = await getToken();
            dispatch(setToken(storedToken));
        };
        restoreSession();
    }, [dispatch]);

    if (isBootstrapping) {
        return (
            <Screen>
                <Container>
                    <SkeletonLoader loading count={4} />
                </Container>
            </Screen>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* {token ? ( */}
                <Stack.Screen name="Main" component={StackNavigator} />
                {/* // ) : (
                //     <Stack.Screen name="Auth" component={AuthNavigator} /> */}
                {/* // )} */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    isBootstrapping: boolean;
}

const initialState: AuthState = {
    token: null,
    isBootstrapping: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
            state.isBootstrapping = false;
        },
        logout: state => {
            state.token = null;
        },
    },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;

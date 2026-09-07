import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { type User, getInitialUser } from '../models/modelUser';

const initialState = getInitialUser();

const sliceUser = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(_state, action: PayloadAction<User>) {
            return {
                ...action.payload,
                isLoaded: true,
            };
        },
        clearUser() {
            return getInitialUser();
        },
    },
});

export const { setUser, clearUser } = sliceUser.actions;
export default sliceUser.reducer;
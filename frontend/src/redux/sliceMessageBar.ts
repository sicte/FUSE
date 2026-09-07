import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface MessageBar {
    message: string;
    color: string;
    key: number;
}

const getInitialMessageBar = (): MessageBar => ({
    message: '',
    color: 'white',
    key: 0
})

const initialState = getInitialMessageBar();


const sliceMessageBar = createSlice({
    name: 'messagebar',
    initialState,
    reducers: {
        setMessageBar(state, action: PayloadAction<{ message: string, color?: string }>) {
            state.message = action.payload.message;
            state.color = action.payload.color || 'white';
            state.key += 1;
        }
    }
});

export const { setMessageBar } = sliceMessageBar.actions;
export default sliceMessageBar.reducer;
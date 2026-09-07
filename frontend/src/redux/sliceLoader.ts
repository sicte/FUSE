import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Loader {
    isLoading: boolean;
}

const getInitialLoader = (): Loader => ({
    isLoading: false,
})

const initialState = getInitialLoader();

const sliceLoader = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        setLoader(_state, action: PayloadAction<Loader>) {
            return action.payload;
        }
    }
});

export const { setLoader } = sliceLoader.actions;
export default sliceLoader.reducer;
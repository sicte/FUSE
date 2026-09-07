import { configureStore } from "@reduxjs/toolkit";
import sliceUser from './sliceUser';
import sliceLoader from './sliceLoader'
import sliceMessageBar from './sliceMessageBar';
import sliceMessages from './sliceMessages';

export const store = configureStore({
    reducer: {
        user: sliceUser,
        messageBar: sliceMessageBar,
        loader: sliceLoader,
        messages: sliceMessages
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
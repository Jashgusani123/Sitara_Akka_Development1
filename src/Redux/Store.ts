import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./Slices/languageSlice";
import resourcesReducer from "./Slices/resourcesSlice";
import entriesReducer from "./Slices/entriesSlice";
import subDataReducer from "./Slices/subDataSlice";
import resourceItemsReducer from "./Slices/resourceItemsSlice";
import userReducer from "./Slices/userSlice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
    resources: resourcesReducer,
    entries: entriesReducer,
    subData: subDataReducer,
    resourceItems: resourceItemsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

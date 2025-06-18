import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

interface ResourceItem {
    _id: string;
    name: string;
    type: string;
}

interface ResourceItemsMap {
    [key: string]: ResourceItem[];
}

interface ResourceItemsState {
    resourceItemsMap: ResourceItemsMap;
}

const initialState: ResourceItemsState = {
    resourceItemsMap: {},
};

const resourceItemsSlice = createSlice({
    name: "resourceItems",
    initialState,
    reducers: {
        setResourceItemsMap: (state, action: PayloadAction<{ key: string; items: ResourceItem[] }>) => {
            state.resourceItemsMap[action.payload.key] = action.payload.items;
        },
        clearResourceItemsMap: (state) => {
            state.resourceItemsMap = {};
        },
    },
});

export const { setResourceItemsMap, clearResourceItemsMap } = resourceItemsSlice.actions;
export default resourceItemsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';

interface ResourceItem {
    _id: string;
    name: string;
    type: string;
    link?: string;
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
        removeResourceItemById: (state, action: PayloadAction<{ key: string; id: string }>) => {
            const { key, id } = action.payload;
            if (state.resourceItemsMap[key]) {
                state.resourceItemsMap[key] = state.resourceItemsMap[key].filter(item => item._id !== id);
            }
        },
        updateResourceItemById: (
            state,
            action: PayloadAction<{ key: string; item: ResourceItem }>
        ) => {
            const { key, item } = action.payload;
            const list = state.resourceItemsMap[key];
            if (list) {
                const index = list.findIndex(resource => resource._id === item._id);
                if (index !== -1) {
                    list[index] = item;
                }
            }
        },
        appendResourceItem: (state, action: PayloadAction<{ key: string; item: ResourceItem }>) => {
            const { key, item } = action.payload;
            if (state.resourceItemsMap[key]) {
                state.resourceItemsMap[key].push(item);
            } else {
                state.resourceItemsMap[key] = [item];
            }
        }

    },
});

export const {
    setResourceItemsMap,
    clearResourceItemsMap,
    removeResourceItemById,
    updateResourceItemById,
    appendResourceItem
} = resourceItemsSlice.actions;

export default resourceItemsSlice.reducer;

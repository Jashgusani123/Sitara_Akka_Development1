import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';

interface SubData {
  _id: string;
  name: string;
  datatype: string;
}

interface SubDataMap {
  [entryId: string]: SubData[];
}

interface SubDataState {
  subDataMap: SubDataMap;
}

const initialState: SubDataState = {
  subDataMap: {},
};

const subDataSlice = createSlice({
  name: "subData",
  initialState,
  reducers: {
    setSubDataMap: (state, action: PayloadAction<{ entryId: string; items: SubData[] }>) => {
      state.subDataMap[action.payload.entryId] = action.payload.items;
    },
    clearSubDataMap: (state) => {
      state.subDataMap = {};
    },
    removeSubDataById: (state, action: PayloadAction<{ entryId: string; id: string }>) => {
      const { entryId, id } = action.payload;
      if (state.subDataMap[entryId]) {
        state.subDataMap[entryId] = state.subDataMap[entryId].filter(item => item._id !== id);
      }
    },
    replaceFirstIfIdMatches: (state, action: PayloadAction<{ entryId: string; item: SubData }>) => {
      const { entryId, item } = action.payload;
      const list = state.subDataMap[entryId];
      if (list && list.length && list[0]._id === item._id) {
        list[0] = item;
      }
    },
    appendSubdata: (state, action: PayloadAction<{ entryId: string; item: SubData }>) => {
      const { entryId, item } = action.payload;
      if (state.subDataMap[entryId]) {
        state.subDataMap[entryId].push(item);
      } else {
        state.subDataMap[entryId] = [item];
      }
    },
  },
});

export const {
  setSubDataMap,
  clearSubDataMap,
  removeSubDataById,
  replaceFirstIfIdMatches,
  appendSubdata
} = subDataSlice.actions;

export default subDataSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';

interface SubData {
  _id: string;
  name: string;
  datatype: string;
}

interface SubDataState {
  subDataMap: SubData[];
}

const initialState: SubDataState = {
  subDataMap: [],
};

const subDataSlice = createSlice({
  name: "subData",
  initialState,
  reducers: {
    setSubDataMap: (state, action: PayloadAction<SubData[]>) => {
      state.subDataMap = action.payload;
    },
    clearSubDataMap: (state) => {
      state.subDataMap = [];
    },
    removeSubDataById: (state, action: PayloadAction<string>) => {
      state.subDataMap = state.subDataMap.filter(item => item._id !== action.payload);
    },
    replaceFirstIfIdMatches: (state, action: PayloadAction<SubData>) => {
      if (state.subDataMap.length && state.subDataMap[0]._id === action.payload._id) {
        state.subDataMap[0] = action.payload;
      }
    },
  },
});

export const {
  setSubDataMap,
  clearSubDataMap,
  removeSubDataById,
  replaceFirstIfIdMatches
} = subDataSlice.actions;

export default subDataSlice.reducer;

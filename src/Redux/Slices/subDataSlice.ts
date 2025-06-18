import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from '@reduxjs/toolkit'

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
  },
});

export const { setSubDataMap, clearSubDataMap } = subDataSlice.actions;
export default subDataSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from '@reduxjs/toolkit'
interface Entry {
  _id: string;
  type: string;
}

interface EntriesState {
  entries: Entry[];
}

const initialState: EntriesState = {
  entries: [],
};

const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    setEntries: (state, action: PayloadAction<Entry[]>) => {
      state.entries = action.payload;
    },
    clearEntries: (state) => {
      state.entries = [];
    },
  },
});

export const { setEntries, clearEntries } = entriesSlice.actions;
export default entriesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';

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
    removeEntryById: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(entry => entry._id !== action.payload);
    },
    replaceFirstIfIdMatches: (state, action: PayloadAction<Entry>) => {
      if (state.entries.length && state.entries[0]._id === action.payload._id) {
        state.entries[0] = action.payload;
      }
    },
  },
});

export const {
  setEntries,
  clearEntries,
  removeEntryById,
  replaceFirstIfIdMatches
} = entriesSlice.actions;

export default entriesSlice.reducer;

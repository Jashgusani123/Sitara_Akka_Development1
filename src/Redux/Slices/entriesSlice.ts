import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface Entry {
  _id: string;
  type: string;
}

interface EntriesMap {
  [resourceId: string]: Entry[];
}

interface EntriesState {
  entriesMap: EntriesMap;
}

const initialState: EntriesState = {
  entriesMap: {},
};

const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    setEntriesForResource: (
      state,
      action: PayloadAction<{ resourceId: string; entries: Entry[] }>
    ) => {
      state.entriesMap[action.payload.resourceId] = action.payload.entries;
    },

    appendEntryToResource: (
      state,
      action: PayloadAction<{ resourceId: string; entry: Entry }>
    ) => {
      const { resourceId, entry } = action.payload;
      if (!state.entriesMap[resourceId]) {
        state.entriesMap[resourceId] = [entry];
      } else {
        const exists = state.entriesMap[resourceId].some(e => e._id === entry._id);
        if (!exists) {
          state.entriesMap[resourceId].push(entry);
        }
      }
    },

    removeEntryFromResource: (
      state,
      action: PayloadAction<{ resourceId: string; entryId: string }>
    ) => {

      const { resourceId, entryId } = action.payload;
      if (state.entriesMap[resourceId]) {
        state.entriesMap[resourceId] = state.entriesMap[resourceId].filter(
          entry => entry._id !== entryId
        );
      }
    },
    updateEntryForResource: (
      state,
      action: PayloadAction<{ resourceId: string; entry: Entry }>
    ) => {
      const { resourceId, entry } = action.payload;
      const entries = state.entriesMap[resourceId];
      if (entries) {
        const index = entries.findIndex(e => e._id === entry._id);
        if (index !== -1) {
          entries[index] = entry;
        }
      }
    },

    clearAllEntries: (state) => {
      state.entriesMap = {};
    }
  },
});

export const {
  setEntriesForResource,
  appendEntryToResource,
  removeEntryFromResource,
  clearAllEntries,
  updateEntryForResource
} = entriesSlice.actions;

export default entriesSlice.reducer;

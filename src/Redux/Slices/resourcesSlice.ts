import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Resource {
  _id: string;
  lan: string;
  class: string;
  subj: string;
}

interface ResourceState {
  resources: Resource[];
}

const initialState: ResourceState = {
  resources: [],
};

const resourceSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    setResources: (state, action: PayloadAction<Resource[]>) => {
      state.resources = action.payload;
    },
    clearResources: (state) => {
      state.resources = [];
    },
    removeResourceById: (state, action: PayloadAction<string>) => {
      state.resources = state.resources.filter(r => r._id !== action.payload);
    },
    replaceFirstIfIdMatches: (state, action: PayloadAction<Resource>) => {
      if (state.resources.length && state.resources[0]._id === action.payload._id) {
        state.resources[0] = action.payload;
      }
    },
    appendResource: (state, action: PayloadAction<Resource>) => {
      const newResource = action.payload;

      const langExists = state.resources.some(r => r.lan === newResource.lan);

      if (langExists) {
        state.resources.push(newResource);
      }
    }

  },
});

export const { setResources, clearResources, removeResourceById, replaceFirstIfIdMatches, appendResource } = resourceSlice.actions;
export default resourceSlice.reducer;

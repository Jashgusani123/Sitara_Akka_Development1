import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Resource {
  _id: string;
  lan: string;
  class: string;
  subj: string;
  types:[string]
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
    updateResourceById: (state, action: PayloadAction<Resource>) => {
      const index = state.resources.findIndex(r => r._id === action.payload._id);
      if (index !== -1) {
        state.resources[index] = action.payload;
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

export const {
  setResources,
  clearResources,
  removeResourceById,
  updateResourceById,
  appendResource
} = resourceSlice.actions;

export default resourceSlice.reducer;
export const selectUniqueClasses = (state: { resources: ResourceState }) => {
  const classSet = new Set(state.resources.resources.map(r => r.class));
  return Array.from(classSet);
};
export const selectResourceById = (id: string) => (state: { resources: ResourceState }) => {
  return state.resources.resources.find(r => r._id === id);
};
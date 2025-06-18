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
  },
});

export const { setResources, clearResources } = resourceSlice.actions;
export default resourceSlice.reducer;

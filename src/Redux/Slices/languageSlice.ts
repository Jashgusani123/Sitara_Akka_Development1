import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  selectedLanguage: string;
  gottedLanguages: string[]; 
}

const initialState: LanguageState = {
  selectedLanguage: "",
  gottedLanguages: [], 
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload;
    },
    setGottedLanguages: (state, action: PayloadAction<string[]>) => {
      state.gottedLanguages = action.payload;
    },
  },
});

export const { setLanguage, setGottedLanguages } = languageSlice.actions;
export default languageSlice.reducer;

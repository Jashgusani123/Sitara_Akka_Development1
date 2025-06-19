import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  phone: string;
  firstName: string;
  lastName: string;
  age: number;
  standard: string;
  gender: string;
  role: string; 
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

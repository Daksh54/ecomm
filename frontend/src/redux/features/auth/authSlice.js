import { createSlice } from '@reduxjs/toolkit';

let user = null;
try {
  const storedUser = localStorage.getItem('userInfo');
  if (storedUser && storedUser !== 'undefined') {
    user = JSON.parse(storedUser);
  }
} catch (e) {
  console.error('Failed to parse userInfo from localStorage', e);
  localStorage.removeItem('userInfo');
}

const initialState = {
  userInfo: user,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem('expirationTime', expirationTime);
    },

    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('expirationTime');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

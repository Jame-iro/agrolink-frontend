import { createSlice } from "@reduxjs/toolkit";

// Get initial role from localStorage or default to 'consumer'
const getInitialRole = () => {
  return localStorage.getItem("agrolink-role") || "consumer";
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    role: getInitialRole(),
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
      // Persist role in localStorage
      localStorage.setItem("agrolink-role", action.payload);
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.role = "consumer";
      localStorage.removeItem("agrolink-role");
    },
  },
});

export const { setUser, setRole, clearUser } = userSlice.actions;
export default userSlice.reducer;

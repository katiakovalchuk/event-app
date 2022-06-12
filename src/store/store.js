import { configureStore } from "@reduxjs/toolkit";
import usersSlice  from "./slices/usersSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
      usersSlice,
      userSlice
  },
});

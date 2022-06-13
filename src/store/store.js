import { configureStore } from "@reduxjs/toolkit";

import usersSlice from "./slices/usersSlice";
import userSlice from "./slices/userSlice";
import eventsSlice from "./slices/eventsSlice";

export const store = configureStore({
  reducer: {
    usersSlice,
    userSlice,
    eventsSlice,
  },
});

import { configureStore } from "@reduxjs/toolkit";

import usersSlice from "./slices/usersSlice";
import eventsSlice from "./slices/eventsSlice";

export const store = configureStore({
  reducer: {
    usersSlice,
    eventsSlice,
  },
});

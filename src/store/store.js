import { configureStore } from "@reduxjs/toolkit";

import usersSlice from "./slices/usersSlice";
import membersSlice from "./slices/membersSlice";
import userSlice from "./slices/userSlice";
import eventsSlice from "./slices/eventsSlice";
import eventSlice from "./slices/eventSlice";

export const store = configureStore({
  reducer: {
    usersSlice,
    membersSlice,
    userSlice,
    eventsSlice,
    eventSlice,
  },
});

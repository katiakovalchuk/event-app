import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";

import { ROLES, STATUSES } from "../data";
import { db } from "../../lib/init-firebase";

const initialState = {
  status: null,
  user: null,
  eventsList: [],
};

export const getUserByEmail = createAsyncThunk(
  "userSlice/getUserById",
  async (email, { rejectWithValue }) => {
    try {
      const querySnap = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );
      return querySnap.docs[0].data();
    } catch (err) {
      return rejectWithValue(STATUSES.failed);
    }
  }
);

export const getUserEventsList = createAsyncThunk(
  "userSlice/getNewMember",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const snapRef = collection(db, `users/${id}/eventsList`);
      const response = await getDocs(snapRef);
      const eventsList = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      dispatch(getEventsList(eventsList));
    } catch (err) {
      console.log(err);
      return rejectWithValue(STATUSES.failed);
    }
  }
);
// helpers
const setSuccess = (state) => {
  state.status = "succeeded";
};
const setError = (state, action) => {
  state.status = "failed";
  state.error = action.payload;
};

const setLoading = (state) => {
  state.status = "loading";
  state.error = null;
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    getEventsList(state, action) {
      state.eventsList = action.payload;
    },
  },
  extraReducers: {
    [getUserByEmail.fulfilled]: (state, action) => {
      state.status = STATUSES.succeeded;
      state.user = action.payload?.role
        ? action.payload
        : { ...action.payload, role: ROLES.user };
    },
    [getUserByEmail.pending]: (state) => {
      state.status = STATUSES.pending;
    },
    [getUserByEmail.rejected]: (state, action) => {
      state.status = action.payload;
    },
    [getUserEventsList.fulfilled]: setSuccess,
    [getUserEventsList.pending]: setLoading,
    [getUserEventsList.rejected]: setError,
  },
});
export const { getEventsList } = userSlice.actions;
export default userSlice.reducer;

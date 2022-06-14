import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoc, doc } from "firebase/firestore";

import { db } from "../../lib/init-firebase.js";

const initialState = {
  status: null,
  error: null,
  event: [],
};

export const getEvent = createAsyncThunk(
  "eventSlice/getEvent",
  async (id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const response = { ...docSnap.data(), id: docSnap.id };
        return response;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

//helpers
// const setSuccess = (state) => {
//   state.status = "succeeded";
// };
const setError = (state, action) => {
  state.status = "failed";
  state.error = action.payload;
};

const setLoading = (state) => {
  state.status = "loading";
  state.error = null;
};

const eventSlice = createSlice({
  name: "eventSlice",
  initialState,
  reducers: {},
  extraReducers: {
    [getEvent.rejected]: setError,
    [getEvent.pending]: setLoading,
    [getEvent.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.event = action.payload;
    },
  },
});

export default eventSlice.reducer;

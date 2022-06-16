import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

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
        return { ...docSnap.data(), id: docSnap.id };
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);
export const addUserToEvent = createAsyncThunk(
  "eventSlice/addUserToEvent",
  async ({ uid, eid }, { rejectedWithValue, dispatch }) => {
    try {
      await updateDoc(doc(db, "events", eid), {
        membersList: arrayUnion(uid),
      });
      dispatch(addUser(uid));
    } catch (error) {
      console.log(error);
      return rejectedWithValue(error);
    }
  }
);

export const deleteUserFromEvent = createAsyncThunk(
  "eventSlice/deleteUserFromEvent",
  async ({ eid, uid }, { rejectWithValue, dispatch }) => {
    try {
      await updateDoc(doc(db, "events", eid), {
        membersList: arrayRemove(uid),
      });
      dispatch(deleteUser(uid));
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
  reducers: {
    addUser(state, action) {
      state.event.membersList.push(action.payload);
    },
    deleteUser(state, action) {
      state.event.membersList = state.event.membersList.filter(
        (id) => id !== action.payload
      );
    },
  },
  extraReducers: {
    [getEvent.rejected]: setError,
    [getEvent.pending]: setLoading,
    [getEvent.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.event = action.payload;
    },
  },
});
const { addUser, deleteUser } = eventSlice.actions;

export default eventSlice.reducer;

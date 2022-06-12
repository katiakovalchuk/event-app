import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { eventsCollectionRef } from "../../lib/firestore.collections";
import {
  addDoc,
  collection,
  setDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../lib/init-firebase.js";
import { async } from "@firebase/util";

const initialState = {
  status: null,
  error: null,
  events: [],
};

export const getEvents = createAsyncThunk(
  "eventsSlice/getEvents",
  async function (_, { rejectWithValue }) {
    try {
      const response = await getDocs(eventsCollectionRef);
      console.log(response.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      return response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const addNewEvent = createAsyncThunk(
  "eventsSlice/addNewEvent",
  async function (event, { rejectWithValue, dispatch }) {
    try {
      const docRef = await addDoc(eventsCollectionRef, event);
      const newEvent = { ...event, id: docRef.id };
      console.log(newEvent);
      dispatch(addEvent(newEvent));
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

//helpers
const setError = (state, action) => {
  state.status = "failed";
  state.error = action.payload;
};

const setLoading = (state) => {
  state.status = "loading";
  state.error = null;
};

//eventsSlice
const eventsSlice = createSlice({
  name: "eventsSlice",
  initialState,
  reducers: {
    addEvent(state, action) {
      state.events.push(action.payload);
    },
  },
  extraReducers: {
    [getEvents.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.events = action.payload;
    },
    [getEvents.rejected]: setError,
    [getEvents.pending]: setLoading,
    [addNewEvent.rejected]: setError,
  },
});

const { addEvent } = eventsSlice.actions;
export const selectAllEvents = (state) => state.eventsSlice.events;
export default eventsSlice.reducer;

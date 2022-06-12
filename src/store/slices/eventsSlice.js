import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { eventsCollectionRef } from "../../lib/firestore.collections";
import { addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

import { db } from "../../lib/init-firebase.js";

const initialState = {
  status: null,
  error: null,
  events: [],
};

export const getEvents = createAsyncThunk(
  "eventsSlice/getEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDocs(eventsCollectionRef);
      return response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addNewEvent = createAsyncThunk(
  "eventsSlice/addNewEvent",
  async (event, { rejectWithValue, dispatch }) => {
    try {
      const docRef = await addDoc(eventsCollectionRef, event);
      const newEvent = { ...event, id: docRef.id };
      dispatch(addEvent(newEvent));
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNewEvent = createAsyncThunk(
  "eventsSlice/deleteEvent",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await deleteDoc(doc(db, "events", id));
      dispatch(deleteEvent(id));
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const updateNewEvent = createAsyncThunk(
  "eventsSlice/updateNewEvent",
  async (event, { rejectWithValue, dispatch }) => {
    const { id, ...rest } = event;
    try {
      await updateDoc(doc(db, "events", id), { ...rest });
      dispatch(updateEvent(event));
    } catch (error) {
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
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },
    updateEvent(state, action) {
      state.events = state.events.map((event) =>
        event.id === action.payload.id ? action.payload : event
      );
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

const { addEvent, deleteEvent, updateEvent } = eventsSlice.actions;
export const selectAllEvents = (state) => state.eventsSlice.events;
export default eventsSlice.reducer;

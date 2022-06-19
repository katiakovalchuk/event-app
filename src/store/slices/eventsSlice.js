import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { eventsCollectionRef } from "../../lib/firestore.collections";
import { addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../../lib/init-firebase.js";

const initialState = {
  status: null,
  error: null,
  events: [],
};

export const getNewEvents = createAsyncThunk(
  "eventsSlice/getNewEvents",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await getDocs(eventsCollectionRef);
      const events = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch(getEvents(events));
    } catch (error) {
      return rejectWithValue(error.message);
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
      toast.success("The event was added successfully");
    } catch (error) {
      toast.error("Sorry, Can't add an Event");
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
      toast.success("The event was deleted successfully");
    } catch (error) {
      toast.error("Sorry, Can't delete an Event");
      return rejectWithValue(error.message);
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
      toast.success("The event was updated successfully");
    } catch (error) {
      toast.error("Sorry, Can't update an Event");
      return rejectWithValue(error.message);
    }
  }
);

//helpers
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

//eventsSlice
const eventsSlice = createSlice({
  name: "eventsSlice",
  initialState,
  reducers: {
    getEvents: (state, action) => {
      state.events = action.payload;
    },
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
    [getNewEvents.pending]: setLoading,
    [getNewEvents.fulfilled]: setSuccess,
    [getNewEvents.rejected]: setError,
    [addNewEvent.pending]: setLoading,
    [addNewEvent.fulfilled]: setSuccess,
    [addNewEvent.rejected]: setError,
    [deleteNewEvent.pending]: setLoading,
    [deleteNewEvent.fulfilled]: setSuccess,
    [deleteNewEvent.rejected]: setError,
    [updateNewEvent.pending]: setLoading,
    [updateNewEvent.fulfilled]: setSuccess,
    [updateNewEvent.rejected]: setError,
  },
});

const { getEvents, addEvent, deleteEvent, updateEvent } = eventsSlice.actions;
export const selectAllEvents = (state) => state.eventsSlice.events;
export default eventsSlice.reducer;

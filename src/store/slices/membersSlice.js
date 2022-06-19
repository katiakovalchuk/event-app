import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
import { toast } from "react-toastify";

import { usersCollectionRef } from "../../lib/firestore.collections";

import { db } from "../../lib/init-firebase";

const initialState = {
  status: null,
  error: null,
  members: [],
};

export const getNewMembers = createAsyncThunk(
  "membersSlice/getNewMembers",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const q = query(usersCollectionRef, where("role", "==", "user"));
      const querySnap = await getDocs(q);

      const members = querySnap.docs.map(async (doc) => {
        const snapRef = collection(db, `users/${doc.id}/eventsList`);
        const allEvents = await getDocs(snapRef);
        return {
          ...doc.data(),
          id: doc.id,
          eventsList: allEvents
            ? allEvents?.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }))
            : [],
        };
      });

      const result = await Promise.all(members);

      dispatch(getMembers(result));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//connect
export const addEventToMember = createAsyncThunk(
  "membersSlice/addEventToMember",
  async (event, { rejectWithValue, dispatch }) => {
    try {
      const docRef = doc(db, "users", event.uid);
      const colRef = collection(docRef, "eventsList");
      await setDoc(doc(colRef, event.id), event);
      dispatch(addEvent(event));
    } catch (error) {
      toast.error("Sorry, Can't register user");
      return rejectWithValue(error);
    }
  }
);

export const deleteEventFromMember = createAsyncThunk(
  "membersSlice/deleteEventFromMember",
  async ({ uid, id }, { rejectWithValue, dispatch }) => {
    try {
      const docRef = doc(db, "users", uid);
      const colRef = collection(docRef, "eventsList");
      await deleteDoc(doc(colRef, id));
      dispatch(deleteEvent({ uid, id }));
    } catch (error) {
      toast.error("Sorry, can't delete user");
      return rejectWithValue(error);
    }
  }
);

export const toggleStatus = createAsyncThunk(
  "membersSlice/toggleStatus",
  async ({ uid, id }, { rejectWithValue, dispatch, getState }) => {
    const currentMember = getState().membersSlice.members.find(
      (member) => member.id === uid
    );
    const currentEvent = currentMember.eventsList.find(
      (event) => event.id === id
    );
    try {
      const docRef = doc(db, "users", uid);
      const colRef = collection(docRef, "eventsList");
      await updateDoc(doc(colRef, id), { isPresent: !currentEvent.isPresent });
      dispatch(toggleEvent({ uid, id }));
    } catch (error) {
      toast.error("Sorry, can't check user");
      return rejectWithValue(error.message);
    }
  }
);

export const updateAdditionalInfo = createAsyncThunk(
  "membersSlice/updateAdditionalInfo",
  async (
    { uid, id, comment, additionalPoints },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const docRef = doc(db, "users", uid);
      const colRef = collection(docRef, "eventsList");
      await updateDoc(doc(colRef, id), {
        comment: comment,
        additionalPoints: additionalPoints,
      });
      dispatch(updateInfo({ uid, id, comment, additionalPoints }));
      toast.success("Additional information was saved successfully");
    } catch (error) {
      toast.error("Sorry, can't save additional information");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAllMembersFromEvent = createAsyncThunk(
  "membersSlice/deleteEvents",
  async (id, { rejectWithValue, getState }) => {
    const currentEvent = getState().eventSlice.event;
    const membersList = currentEvent.membersList;

    try {
      for (let i = 0; i < membersList.length; i++) {
        const docRef = doc(db, "users", membersList[i]);
        const colRef = collection(docRef, "eventsList");
        await deleteDoc(doc(colRef, id));
      }
    } catch (error) {
      toast.error("Sorry, can't delete event");
      return rejectWithValue(error.message);
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

const membersSlice = createSlice({
  name: "usersSlice",
  initialState,
  reducers: {
    getMembers(state, action) {
      state.members = action.payload;
    },

    addEvent(state, action) {
      const { uid } = action.payload;
      const currentMember = state.members.find((member) => member.id === uid);
      currentMember.eventsList.push(action.payload);
    },
    deleteEvent(state, action) {
      const { uid, id } = action.payload;
      const currentMember = state.members.find((member) => member.id === uid);
      currentMember.eventsList = currentMember.eventsList.filter(
        (member) => member.id !== id
      );
    },
    toggleEvent(state, action) {
      const { uid, id } = action.payload;
      const currentMember = state.members.find((member) => member.id === uid);
      const currentInfo = currentMember.eventsList.find(
        (info) => info.id === id
      );
      currentInfo.isPresent = !currentInfo.isPresent;
    },
    updateInfo(state, action) {
      const { uid, id, comment, additionalPoints } = action.payload;
      const currentMember = state.members.find((member) => member.id === uid);

      const currentInfo = currentMember.eventsList.find(
        (info) => info.id === id
      );
      currentInfo.comment = comment;
      currentInfo.additionalPoints = additionalPoints;
    },
  },
  extraReducers: {
    [getNewMembers.fulfilled]: setSuccess,
    [getNewMembers.rejected]: setError,
    [getNewMembers.pending]: setLoading,
    [addEventToMember.fulfilled]: setSuccess,
    [addEventToMember.rejected]: setError,
    [addEventToMember.pending]: setLoading,
    [deleteEventFromMember.fulfilled]: setSuccess,
    [deleteEventFromMember.rejected]: setError,
    [deleteEventFromMember.pending]: setLoading,
    [toggleStatus.fulfilled]: setSuccess,
    [toggleStatus.rejected]: setError,
    [toggleStatus.pending]: setLoading,
    [updateAdditionalInfo.fulfilled]: setSuccess,
    [updateAdditionalInfo.rejected]: setError,
    [updateAdditionalInfo.pending]: setLoading,
    [deleteAllMembersFromEvent.fulfilled]: setSuccess,
    [deleteAllMembersFromEvent.rejected]: setError,
    [deleteAllMembersFromEvent.pending]: setLoading,
  },
});
const { getMembers, addEvent, deleteEvent, toggleEvent, updateInfo } =
  membersSlice.actions;
export default membersSlice.reducer;

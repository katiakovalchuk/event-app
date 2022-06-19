import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";

import { usersCollectionRef } from "../../lib/firestore.collections";

import { STATUSES } from "../data";
import { db } from "../../lib/init-firebase";

const initialState = {
  status: null,
  users: [],
  members: [],
};

export const getUsers = createAsyncThunk(
  "usersSlice/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const docsSnap = await getDocs(collection(db, "users"));
      return docsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (err) {
      return rejectWithValue(STATUSES.failed);
    }
  }
);

export const addNewUserWithAutoId = createAsyncThunk(
  "usersSlice/addNewUser",
  async (newUser, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "users"), newUser);
      return { ...newUser, id: docRef.id };
    } catch (err) {
      return rejectWithValue(STATUSES.failed);
    }
  }
);

export const updateUser = createAsyncThunk(
  "usersSlice/updateUser",
  async (updatedUser, { rejectWithValue }) => {
    const { id, ...rest } = updatedUser;
    try {
      await updateDoc(doc(db, "users", id), { ...rest });
      return updatedUser;
    } catch (err) {
      return rejectWithValue(STATUSES.failed);
    }
  }
);

export const setUserWithCustomId = createAsyncThunk(
  "usersSlice/addNewUser",
  async (newUser, { rejectWithValue }) => {
    const { id, ...userData } = newUser;
    try {
      await setDoc(doc(db, "users", id), userData, { merge: true });
      return newUser;
    } catch (err) {
      return rejectWithValue(STATUSES.failed);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "usersSlice/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "users", id));
      return id;
    } catch (err) {
      return rejectWithValue(STATUSES.failed);
    }
  }
);
// members
export const getMembers = createAsyncThunk(
  "usersSlice/getMembers",
  async (_, { rejectWithValue }) => {
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

      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
//connect
export const addEventToMember = createAsyncThunk(
  "usersSlice/addEventToMember",
  async (event, { rejectWithValue, dispatch }) => {
    try {
      const docRef = doc(db, "users", event.uid);
      const colRef = collection(docRef, "eventsList");
      await setDoc(doc(colRef, event.id), event);
      dispatch(addEvent(event));
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteEventFromMember = createAsyncThunk(
  "usersSlice/deleteEventFromMember",
  async ({ uid, id }, { rejectWithValue, dispatch }) => {
    try {
      const docRef = doc(db, "users", uid);
      const colRef = collection(docRef, "eventsList");
      await deleteDoc(doc(colRef, id));
      dispatch(deleteEvent({ uid, id }));
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const toggleStatus = createAsyncThunk(
  "usersSlice/toggleStatus",
  async ({ uid, id }, { rejectWithValue, dispatch, getState }) => {
    const currentMember = getState().usersSlice.members.find(
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
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateAdditionalInfo = createAsyncThunk(
  "usersSlice/updateAdditionalInfo",
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
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEvents = createAsyncThunk(
  "usersSkice/deleteEvents",
  async (id, { rejectWithValue, getState }) => {
    const events = getState().eventsSlice.events;
    const currentEvent = events.find((event) => event.id === id);
    const membersList = currentEvent.membersList;

    try {
      for (let i = 0; i < membersList.length; i++) {
        const docRef = doc(db, "users", membersList[i]);
        const colRef = collection(docRef, "eventsList");
        await deleteDoc(doc(colRef, id));
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);
const setError = (state, action) => {
  state.status = action.payload;
};

const setPending = (state) => {
  state.status = STATUSES.pending;
};

const usersSlice = createSlice({
  name: "usersSlice",
  initialState,
  reducers: {
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
    [getUsers.fulfilled]: (state, action) => {
      state.status = STATUSES.succeeded;
      state.users = action.payload;
    },
    [getMembers.fulfilled]: (state, action) => {
      state.status = STATUSES.succeeded;
      state.members = action.payload;
    },
    [addNewUserWithAutoId.fulfilled]: (state, action) => {
      state.status = STATUSES.succeeded;
      state.users.push(action.payload);
    },
    [updateUser.fulfilled]: (state, action) => {
      state.status = STATUSES.succeeded;
      state.users = state.users.map((user) => {
        state.status = STATUSES.succeeded;
        return user.id === action.payload.id
          ? { ...user, ...action.payload }
          : user;
      });
    },
    [setUserWithCustomId.fulfilled]: (state, action) => {
      let isSet = false;
      state.status = STATUSES.succeeded;
      state.users = state.users.map((user) => {
        if (user.id === action.payload.id) {
          isSet = true;
          return { ...user, ...action.payload };
        } else {
          return user;
        }
      });
      if (!isSet) {
        state.users.push(action.payload);
      }
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.status = STATUSES.succeeded;
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    [getUsers.pending]: setPending,
    [addNewUserWithAutoId.pending]: setPending,
    [updateUser.pending]: setPending,
    [setUserWithCustomId]: setPending,
    [deleteUser.pending]: setPending,
    [getUsers.rejected]: setError,
    [addNewUserWithAutoId.rejected]: setError,
    [updateUser.rejected]: setError,
    [setUserWithCustomId]: setError,
    [deleteUser.rejected]: setError,
  },
});
const { addEvent, deleteEvent, toggleEvent, updateInfo } = usersSlice.actions;
export default usersSlice.reducer;

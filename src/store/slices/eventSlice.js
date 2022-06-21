import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../lib/init-firebase.js";

const initialState = {
  status: null,
  error: null,
  event: [],
};

export const getNewEvent = createAsyncThunk(
  "eventSlice/getNewEvent",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);
      const event = { ...docSnap.data(), id: docSnap.id };
      dispatch(getEvent(event));
    } catch (error) {
      toast.error("Sorry, can't get event");
      return rejectWithValue(error.message);
    }
  }
);
export const addUserToEvent = createAsyncThunk(
  "eventSlice/addUserToEvent",
  async ({ id, uid }, { rejectedWithValue, dispatch }) => {
    try {
      await updateDoc(doc(db, "events", id), {
        membersList: arrayUnion(uid),
      });
      dispatch(addUser(uid));
    } catch (error) {
      toast.error("Sorry, can't register user");
      return rejectedWithValue(error.message);
    }
  }
);

export const deleteUserFromEvent = createAsyncThunk(
  "eventSlice/deleteUserFromEvent",
  async ({ id, uid }, { rejectWithValue, dispatch }) => {
    try {
      await updateDoc(doc(db, "events", id), {
        membersList: arrayRemove(uid),
      });
      dispatch(deleteUser(uid));
    } catch (error) {
      toast.error("Sorry, can't unregister user");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNewMembersList = createAsyncThunk(
  "eventSlice/deleteNewMembersList",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await updateDoc(doc(db, "events", id), {
        membersList: [],
      });
      dispatch(deleteMembersList());
      toast.success("All users were unregistered successfully");
    } catch (error) {
      toast.error("Sorry, can't unregister all users");
      return rejectWithValue(error.message);
    }
  }
);

export const addAllUserEvent = createAsyncThunk(
  "eventSlice/addAllUserToMembersList",
  async (id, { rejectWithValue, dispatch, getState }) => {
    const members = getState().membersSlice.members;

    const membersList = getState().eventSlice.event.membersList;
    const unregisteredMem = members.filter(
      (member) => !membersList.includes(member.id)
    );
    try {
      unregisteredMem.map(async (member) => {
        await updateDoc(doc(db, "events", id), {
          membersList: arrayUnion(member.id),
        });
        dispatch(addUser(member.id));
      });
      toast.success("All users were registered successfully");
    } catch (error) {
      toast.error("Sorry, can't register all users");
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

const eventSlice = createSlice({
  name: "eventSlice",
  initialState,
  reducers: {
    getEvent(state, action) {
      state.event = action.payload;
    },
    addUser(state, action) {
      state.event.membersList.push(action.payload);
    },
    deleteUser(state, action) {
      state.event.membersList = state.event.membersList.filter(
        (id) => id !== action.payload
      );
    },
    deleteMembersList(state) {
      state.event.membersList = [];
    },
  },
  extraReducers: {
    [getNewEvent.fulfilled]: setSuccess,
    [getNewEvent.rejected]: setError,
    [getNewEvent.pending]: setLoading,
    [addUserToEvent.fulfilled]: setSuccess,
    [addUserToEvent.rejected]: setError,
    [addUserToEvent.pending]: setLoading,
    [deleteUserFromEvent.fulfilled]: setSuccess,
    [deleteUserFromEvent.rejected]: setError,
    [deleteUserFromEvent.pending]: setLoading,
    [deleteNewMembersList.fulfilled]: setSuccess,
    [deleteNewMembersList.rejected]: setError,
    [deleteNewMembersList.pending]: setLoading,
    [addAllUserEvent.fulfilled]: setSuccess,
    [addAllUserEvent.rejected]: setError,
    [addAllUserEvent.pending]: setLoading,
  },
});
const { getEvent, addUser, deleteUser, deleteMembersList } = eventSlice.actions;

export default eventSlice.reducer;

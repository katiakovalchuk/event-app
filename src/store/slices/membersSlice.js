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
//deleting member with subcollection
export const deleteNewMember = createAsyncThunk(
  "membersSlice/deleteNewMember",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const docRef = doc(db, "users", id);
      const colRef = collection(docRef, "eventsList");
      const response = await getDocs(colRef);
      const allEvents = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      for (let i = 0; i < allEvents.length; i++) {
        await deleteDoc(doc(colRef, allEvents[i].id));
      }
      await deleteDoc(doc(db, "users", id));

      dispatch(deleteMember(id));
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
      console.log(error);
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

export const deleteEventFromAllUsers = createAsyncThunk(
  "membersSlice/deleteEventFromAllUsers",
  async ({ id, membersList }, { rejectWithValue, dispatch }) => {
    try {
      for (let i = 0; i < membersList.length; i++) {
        const docRef = doc(db, "users", membersList[i]);
        const colRef = collection(docRef, "eventsList");
        await deleteDoc(doc(colRef, id));
        dispatch(deleteEvent({ uid: membersList[i], id }));
      }
    } catch (error) {
      toast.error("Sorry, can't delete event");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAllMembersFromEvent = createAsyncThunk(
  "membersSlice/deleteAllMembersFromEvent",
  async ({ id, membersList }, { rejectWithValue, dispatch }) => {
    try {
      for (let i = 0; i < membersList.length; i++) {
        const docRef = doc(db, "users", membersList[i]);
        const colRef = collection(docRef, "eventsList");
        await deleteDoc(doc(colRef, id));
        dispatch(deleteEvent({ uid: membersList[i], id }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Sorry, can't unregister all users");
      return rejectWithValue(error.message);
    }
  }
);

export const addEventToAllMembers = createAsyncThunk(
  "membersSlice/addAllMembersToEvent",
  async ({ info, membersList }, { rejectWithValue, getState, dispatch }) => {
    const state = getState();
    const members = state.membersSlice.members;

    const unregisteredMem = members.filter(
      (member) => !membersList.includes(member.id)
    );

    try {
      unregisteredMem.map(async (member) => {
        const docRef = doc(db, "users", member.id);
        const colRef = collection(docRef, "eventsList");
        const newInfo = { ...info, uid: member.id };
        await setDoc(doc(colRef, info.id), newInfo);

        dispatch(addEvent(newInfo));
      });
    } catch (error) {
      toast.error("Sorry, can't register all users");
      return rejectWithValue(error.message);
    }
  }
);

export const addNewPointsToMember = createAsyncThunk(
  "membersSlice/addNewPointsToMember",
  async ({ uid, updatedScore }, { rejectWithValue, dispatch }) => {
    try {
      await updateDoc(doc(db, "users", uid), {
        scores: +updatedScore,
      });
      dispatch(changeScore({ uid, updatedScore }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPointstoAllMembers = createAsyncThunk(
  "membersSlice/addPointstoAllMembers",
  async ({ points }, { rejectWithValue, dispatch, getState }) => {
    const state = getState();
    const members = state.membersSlice.members;

    const membersList = state.eventSlice.event.membersList;
    const unregisteredMem = members.filter(
      (member) => !membersList.includes(member.id)
    );
    try {
      for (let i = 0; i < unregisteredMem.length; i++) {
        const updatedScore = +unregisteredMem[i].scores + points;
        await updateDoc(doc(db, "users", unregisteredMem[i].id), {
          scores: updatedScore,
        });
        dispatch(changeScore({ uid: unregisteredMem[i].id, updatedScore }));
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAdditionalPointstoScore = createAsyncThunk(
  "membersSlice/addAdditionalPointstoScore",
  async (
    { uid, id, additionalPoints },
    { rejectWithValue, getState, dispatch }
  ) => {
    const state = getState();
    const members = state.membersSlice.members;
    const currentMember = members.find((member) => member.id === uid);
    const eventsList = currentMember.eventsList;

    const currentInfo = eventsList.find((event) => event.id === id);
    const newAdditionalPoints =
      +additionalPoints - +currentInfo.additionalPoints;

    const updatedScore = +currentMember.scores + +newAdditionalPoints;

    try {
      await updateDoc(doc(db, "users", uid), {
        scores: updatedScore,
      });
      dispatch(changeScore({ uid, updatedScore }));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const subtractPointsFromScore = createAsyncThunk(
  "membersSlice/subtractPointsFromScore",
  async ({ uid, updatedScore }, { rejectWithValue, dispatch }) => {
    try {
      await updateDoc(doc(db, "users", uid), {
        scores: +updatedScore,
      });
      dispatch(changeScore({ uid, updatedScore }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const subtractPointsOfAllFromScore = createAsyncThunk(
  "membersSlice/subtractPointsOfAllFromScore",
  async (
    { id, points, membersList },
    { rejectWithValue, getState, dispatch }
  ) => {
    const state = getState();
    const members = state.membersSlice.members;

    const registeredMem = members.filter((member) =>
      membersList.includes(member.id)
    );

    try {
      for (let i = 0; i < registeredMem.length; i++) {
        const currentInfo = registeredMem[i].eventsList.find(
          (event) => event.id === id
        );
        const sumOfPoints = +points + +currentInfo.additionalPoints;
        const updatedScore = +registeredMem[i].scores - +sumOfPoints;
        await updateDoc(doc(db, "users", registeredMem[i].id), {
          scores: updatedScore,
        });
        dispatch(changeScore({ uid: registeredMem[i].id, updatedScore }));
      }
    } catch (error) {
      console.log(error);
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
  name: "membersSlice",
  initialState,
  reducers: {
    getMembers(state, action) {
      state.members = action.payload;
    },
    deleteMember(state, action) {
      state.members = state.members.filter(
        (member) => member.id !== action.payload
      );
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
    updateInfo(state, action) {
      const { uid, id, comment, additionalPoints } = action.payload;
      const currentMember = state.members.find((member) => member.id === uid);

      const currentInfo = currentMember.eventsList.find(
        (info) => info.id === id
      );
      currentInfo.comment = comment;
      currentInfo.additionalPoints = additionalPoints;
    },
    changeScore(state, action) {
      const { uid, updatedScore } = action.payload;
      const currentMember = state.members.find((member) => member.id === uid);
      currentMember.scores = +updatedScore;
    },
  },
  extraReducers: {
    [getNewMembers.fulfilled]: setSuccess,
    [getNewMembers.rejected]: setError,
    [getNewMembers.pending]: setLoading,
    [deleteNewMember.fulfilled]: setSuccess,
    [deleteNewMember.rejected]: setError,
    [deleteNewMember.pending]: setLoading,
    [addEventToMember.fulfilled]: setSuccess,
    [addEventToMember.rejected]: setError,
    [addEventToMember.pending]: setLoading,
    [deleteEventFromMember.fulfilled]: setSuccess,
    [deleteEventFromMember.rejected]: setError,
    [deleteEventFromMember.pending]: setLoading,
    [updateAdditionalInfo.fulfilled]: setSuccess,
    [updateAdditionalInfo.rejected]: setError,
    [updateAdditionalInfo.pending]: setLoading,
    [deleteEventFromAllUsers.fulfilled]: setSuccess,
    [deleteEventFromAllUsers.rejected]: setError,
    [deleteEventFromAllUsers.pending]: setLoading,
    [deleteAllMembersFromEvent.fulfilled]: setSuccess,
    [deleteAllMembersFromEvent.rejected]: setError,
    [deleteAllMembersFromEvent.pending]: setLoading,
    [addEventToAllMembers.fulfilled]: setSuccess,
    [addEventToAllMembers.rejected]: setError,
    [addEventToAllMembers.pending]: setLoading,
    [addNewPointsToMember.fulfilled]: setSuccess,
    [addNewPointsToMember.rejected]: setError,
    [addNewPointsToMember.pending]: setLoading,
    [addPointstoAllMembers.fulfilled]: setSuccess,
    [addPointstoAllMembers.rejected]: setError,
    [addPointstoAllMembers.pending]: setLoading,
    [addAdditionalPointstoScore.fulfilled]: setSuccess,
    [addAdditionalPointstoScore.rejected]: setError,
    [addAdditionalPointstoScore.pending]: setLoading,
    [subtractPointsFromScore.fulfilled]: setSuccess,
    [subtractPointsFromScore.rejected]: setError,
    [subtractPointsFromScore.pending]: setLoading,
    [subtractPointsOfAllFromScore.fulfilled]: setSuccess,
    [subtractPointsOfAllFromScore.rejected]: setError,
    [subtractPointsOfAllFromScore.pending]: setLoading,
  },
});
export const {
  getMembers,
  deleteMember,
  addEvent,
  deleteEvent,
  toggleEvent,
  updateInfo,
  changeScore,
} = membersSlice.actions;
export default membersSlice.reducer;

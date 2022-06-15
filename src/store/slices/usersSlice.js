import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {collection, doc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,} from "firebase/firestore";

import {STATUSES} from "../data";
import {db} from "../../lib/init-firebase";

const initialState = {
    status: null,
    users: []
};

export const getUsers = createAsyncThunk(
    "usersSlice/getUsers",
    async (_, {rejectWithValue}) => {
        try {
            const docsSnap = await getDocs(collection(db, "users"));
            return docsSnap.docs.map(doc => ({...doc.data(), id: doc.id}));
        } catch (err) {
            return rejectWithValue(STATUSES.failed);
        }
    }
);

export const addNewUserWithAutoId = createAsyncThunk(
    "usersSlice/addNewUser",
    async (newUser, {rejectWithValue}) => {
        try {
            const docRef = await addDoc(collection(db, "users"), newUser);
            return {...newUser, id: docRef.id};
        } catch (err) {
            return rejectWithValue(STATUSES.failed);
        }
    }
);

export const updateUser = createAsyncThunk(
    "usersSlice/updateUser",
    async (updatedUser, {rejectWithValue}) => {
        const {id, ...rest} = updatedUser;
        try {
            await updateDoc(doc(db, "users", id), {...rest});
            return updatedUser;
        } catch (err) {
            return rejectWithValue(STATUSES.failed);
        }
    }
);

export const updateUserByInitialEmail = createAsyncThunk(
    "usersSlice/updateUser",
    async (updatedUser, {rejectWithValue, getState}) => {
        const {initialEmail, ...rest} = updatedUser;
        let id;
        getState().usersSlice.users.forEach(user => {
            if (user.email === initialEmail){
                id = user.id;
            }
        });
        try {
            await updateDoc(doc(db, "users", id), {...rest});
            return updatedUser;
        } catch (err) {
            return rejectWithValue(STATUSES.failed);
        }
    }
);

export const setUserWithCustomId = createAsyncThunk(
    "usersSlice/addNewUser",
    async (newUser, {rejectWithValue}) => {
        const {id, ...userData} = newUser;
        try {
            await setDoc(doc(db, "users", id), userData, { merge: true});
            return newUser;
        } catch (err) {
            return rejectWithValue(STATUSES.failed);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "usersSlice/deleteUser",
    async (id, {rejectWithValue}) => {
        try {
            await deleteDoc(doc(db, "users", id));
            return id;
        } catch (err) {
            return rejectWithValue(STATUSES.failed);
        }
    }
);

const setError = (state, action) => {
    state.status = action.payload;
};

const setPending = state => {
    state.status = STATUSES.pending;
};

const usersSlice = createSlice({
    name: "usersSlice",
    initialState,
    extraReducers: {
        [getUsers.fulfilled]: (state, action) => {
            state.status = STATUSES.succeeded;
            state.users = action.payload;

        },
        [addNewUserWithAutoId.fulfilled]: (state, action) => {
            state.status = STATUSES.succeeded;
            state.users.push(action.payload);
        },
        [updateUser.fulfilled]: (state, action) => {
            state.status = STATUSES.succeeded;
            state.users = state.users.map(user => {
                state.status = STATUSES.succeeded;
                return user.id === action.payload.id ? {...user, ...action.payload} : user;
            });
        },
        [updateUserByInitialEmail.fulfilled]: (state, action) => {
            state.status = STATUSES.succeeded;
            state.users = state.users.map(user => {
                state.status = STATUSES.succeeded;
                const {initialEmail, ...rest} = action.payload;
                return user.email === initialEmail ? {...user, ...rest} : user;
            });
        },
        [setUserWithCustomId.fulfilled]: (state, action) => {
            let isSet = false;
            state.status = STATUSES.succeeded;
            state.users = state.users.map(user => {
                if (user.id === action.payload.id){
                    isSet = true;
                    return {...user, ...action.payload};
                } else {
                    return user;
                }
            });
            if (!isSet){
                state.users.push(action.payload);
            }
        },
        [deleteUser.fulfilled]: (state, action) => {
            state.status = STATUSES.succeeded;
            state.users = state.users.filter(user => user.id !== action.payload);
        },
        [getUsers.pending]: setPending,
        [addNewUserWithAutoId.pending]: setPending,
        [updateUser.pending]: setPending,
        [updateUserByInitialEmail.pending]: setPending,
        [setUserWithCustomId]: setPending,
        [deleteUser.pending]: setPending,
        [getUsers.rejected]: setError,
        [addNewUserWithAutoId.rejected]: setError,
        [updateUser.rejected]: setError,
        [updateUserByInitialEmail.rejected]: setError,
        [setUserWithCustomId]: setError,
        [deleteUser.rejected]: setError
    }
});

export default usersSlice.reducer;

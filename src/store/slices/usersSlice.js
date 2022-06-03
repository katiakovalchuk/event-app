import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";

import {db} from "../../firebase-config";

const initialState = {
    status: null,
    error: null,
    users: []
}

export const getUsers = createAsyncThunk(
    "usersSlice/getUsers",
    async (_, {rejectWithValue}) => {
        try {
            const res = await getDocs(collection(db, "users"));
            return res.docs.map(doc => ({...doc.data(), id: doc.id}));
        } catch (err){
            return rejectWithValue(err.message);
        }
    }
);

export const addNewUser = createAsyncThunk(
    "usersSlice/addNewUser",
    async (newUser, {rejectWithValue, dispatch}) => {
        try {
            const docRef = await addDoc(collection(db, "users"), newUser);
            return {...newUser, id: docRef.id};
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

export const updateUser = createAsyncThunk(
    "usersSlice/updateUser",
    async ({id, ...rest}, {rejectWithValue, dispatch, getState}) => {
        try {
            await updateDoc(doc(db, "users", id), {...rest}, {merge: true});
            dispatch(getUsers());
            return {id, ...rest};
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

export const deleteUser = createAsyncThunk(
    "usersSlice/deleteUser",
    async (id, {rejectWithValue, dispatch}) => {
        try {
            await deleteDoc(doc(db, "users", id));
            dispatch(getUsers());
            return id;
        } catch (err) {
            rejectWithValue(err.message);
        }
    }
);

const setError = (state, action) => {
    state.status = "rejected";
    state.error = action.payload;
}

const removeError = state => {
    state.status = "pending";
    state.error = null;
}

const usersSlice = createSlice({
    name: "usersSlice",
    initialState,
    extraReducers: {
        [getUsers.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.users = action.payload

        },
        [addNewUser.fulfilled]: (state, action) => {
            state.status = "succeeded";
            state.users.push(action.payload);
        },
        [updateUser.fulfilled]: (state, action) => {
            state.status = "succeeded";
            state.users = state.users.map(user => {
                state.status = "succeeded";
                if (user.id === action.payload.id) {
                    return {...user, ...action.payload.rest}
                }
                return user;
            })
        },
        [deleteUser.fulfilled]: (state, action) => {
            state.status = "succeeded";
            state.users = state.users.filter(user => user.id !== action.payload.id);
        },
        [getUsers.pending]: removeError,
        [addNewUser.pending]: removeError,
        [updateUser.pending]: removeError,
        [deleteUser.pending]: removeError,
        [getUsers.rejected]: setError,
        [addNewUser.rejected]: setError,
        [updateUser.rejected]: setError,
        [deleteUser.rejected]: setError
    }
})

export default usersSlice.reducer;

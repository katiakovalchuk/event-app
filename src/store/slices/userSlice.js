import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {collection, getDocs, query, where} from "firebase/firestore";

import {ROLES, STATUSES} from "../data";
import {db} from "../../lib/init-firebase";

const initialState = {
    status: null,
    user: null
};

export const getUserByEmail = createAsyncThunk(
    "userSlice/getUserById",
    async (email, {rejectWithValue}) => {
        try {
            const querySnap = await getDocs(query(collection(db, "users"), where("email", "==", email)));
            return querySnap.docs[0].data();
        } catch (err) {
            return rejectWithValue(STATUSES.failed);
        }
    }
);

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    extraReducers: {
        [getUserByEmail.fulfilled]: (state, action) => {
            state.status = STATUSES.succeeded;
            state.user = action.payload?.role ? action.payload : {...action.payload, role: ROLES.user};
        },
        [getUserByEmail.pending]: state => {
            state.status = STATUSES.pending;
        },
        [getUserByEmail.rejected]: (state, action) => {
            state.status = action.payload;
        }
    }
});

export default userSlice.reducer;

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {doc, getDoc} from "firebase/firestore";

import {ROLES, STATUSES} from "../data";
import {db} from "../../lib/init-firebase";

const initialState = {
    status: null,
    user: null
};

export const getUserById = createAsyncThunk(
    "userSlice/getUserById",
    async (id, {rejectWithValue}) => {
        try {
            const docSnap = await getDoc(doc(db, "users", id));
            return docSnap.data();
        } catch (err) {
            return rejectWithValue(STATUSES.failed);
        }
    }
);

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    extraReducers: {
        [getUserById.fulfilled]: (state, action) => {
            state.status = STATUSES.succeeded;
            state.user = action.payload.role ? action.payload : {...action.payload, role: ROLES.user};
        },
        [getUserById.pending]: state => {
            state.status = STATUSES.pending;
        },
        [getUserById.rejected]: (state, action) => {
            state.status = action.payload;
        }
    }
});

export default userSlice.reducer;

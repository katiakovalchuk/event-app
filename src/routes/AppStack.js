import { Route, Routes } from "react-router-dom";

import {EventsItem, EventsList, Home, MembersPage, NotFoundPage, ProfilePage} from "../pages";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";

export const AppStack = () => {
    const user = {role: "user"};

    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route element={<ProtectedRoute isAllowed={user.role === "user"}/>}>
                    <Route path="profile" element={<ProfilePage/>}/>
                    <Route path="members" element={<MembersPage/>}/>
                    <Route path="events" element={<EventsList/>}/>
                    <Route path="events/:id" element={<EventsItem/>}/>
                </Route>
                <Route element={<ProtectedRoute isAllowed={user.role === "manager"}/>}>
                    <Route path="event-page"/>
                    <Route path="members-management"/>
                </Route>
                <Route element={<ProtectedRoute isAllowed={user.role === "admin"}/>}>
                    <Route path="members-management"/>
                    <Route path="managers-management"/>
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    );
};

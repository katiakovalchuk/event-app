import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Route, Routes} from "react-router-dom";

import {
    AdminMembersManagement,
    EventsItem,
    EventsList,
    Home,
    ManagersManagement,
    MembersPage,
    NotFoundPage,
    ProfilePage,
    TestPage
} from "../pages";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import {useUserAuth} from "../context/authContext";
import {ROLES} from "../store/roles";
import {setUserWithCustomId} from "../store/slices/usersSlice";

export const AppStack = () => {
    const dispatch = useDispatch();
    const {user} = useUserAuth();
    const [userRole, setUserRole] = useState(null);
    const users = useSelector(state => state.usersSlice.users);
    const isUserReceived = user && Object.keys(user).length && users.length;

    useEffect(() => {
        if (isUserReceived){
            const userWithRole = users.find(innerUser => innerUser.id === user.uid);
            if (!userWithRole){
                dispatch(setUserWithCustomId({email: user.email, id: user.uid}));
            }
        }
    },[]);

    useEffect(() => {
        if (user && Object.keys(user).length && users.length) {
            const userWithRole = users.find(innerUser => innerUser.id === user.uid);
            if (userWithRole?.role) {
                setUserRole(userWithRole.role);
            } else {
                setUserRole(ROLES.user);
            }
        }
    }, [users]);

    if (!userRole) {
        return <div>Loading...</div>;
    }

    localStorage.setItem("role", JSON.stringify(userRole));

    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route element={<ProtectedRoute isAllowed={userRole === "user"}/>}>
                    <Route path="profile" element={<ProfilePage/>}/>
                    <Route path="members" element={<MembersPage/>}/>
                    <Route path="events" element={<EventsList/>}/>
                    <Route path="events/:id" element={<EventsItem/>}/>

                    //remove later
                    <Route path="test" element={<TestPage />} />
                </Route>
                <Route element={<ProtectedRoute isAllowed={userRole === "manager"}/>}>
                    <Route path="event-page"/>
                </Route>
                <Route element={<ProtectedRoute isAllowed={userRole === "admin"}/>}>
                    <Route path="managers-management" element={<ManagersManagement/>}/>
                </Route>
                <Route element={<ProtectedRoute isAllowed={userRole === "manager" || userRole === "admin"}/>}>
                    <Route path="members-management" element={<AdminMembersManagement/>}/>
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    );
};

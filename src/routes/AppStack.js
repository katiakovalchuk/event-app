import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { EventsItem, MembersManagement, EventsList, Home, ManagersManagement, MembersPage, NotFoundPage, ProfilePage } from "../pages";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import { getUserById } from "../store/slices/userSlice";
import { useUserAuth } from "../context/authContext";
import { Circles } from "react-loader-spinner";

export const AppStack = () => {
  const dispatch = useDispatch();
  const { user } = useUserAuth();
  const status = useSelector((state) => state.userSlice.status);
  const { user: currUser } = useSelector((state) => state.userSlice);
  const role = currUser?.role;
  useEffect(() => {
    dispatch(getUserById(user.uid));
  }, []);

  if (!status || status === "pending") {
    return (
      <div className="loader">
        <Circles color="#060b26" height={200} width={200} />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route element={<ProtectedRoute isAllowed={role === "user"} />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="events" element={<EventsList />} />
          <Route path="events/:id" element={<EventsItem />} />
        </Route>
        <Route element={<ProtectedRoute isAllowed={role === "manager"} />}>
          <Route path="event-page" />
        </Route>
        <Route element={<ProtectedRoute isAllowed={role === "admin"} />}>
          <Route path="managers-management" element={<ManagersManagement />} />
        </Route>
        <Route element={<ProtectedRoute isAllowed={role === "manager" || role === "admin"} />}>
          <Route path="members-management" element={<MembersManagement />} />;
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

import { Route, Routes } from "react-router-dom";

import Layout from "../components/Layout";
import { EventsItem, EventsList, Home, MembersPage, NotFoundPage, ProfilePage, TestPage, AdminMembersManagement } from "../pages";

export const AppStack = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="adminmembers" element={<AdminMembersManagement />} />
        <Route path="test" element={<TestPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="events" element={<EventsList />} />
        <Route path="events/:id" element={<EventsItem />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

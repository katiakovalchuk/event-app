import { Route, Routes } from "react-router-dom";

import Layout from "../components/Layout";
import { EventsItem, EventsList, RecoveryPage, Home, MembersPage, NotFoundPage, ProfilePage, MembersManagement } from "../pages";

export const AppStack = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="membersmanagement" element={<MembersManagement />} />
        <Route path="recovery" element={<RecoveryPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="events" element={<EventsList />} />
        <Route path="events/:id" element={<EventsItem />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

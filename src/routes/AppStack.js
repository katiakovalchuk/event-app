import { Route, Routes } from "react-router-dom";

import Layout from "../components/Layout";
import {
  EventsItem,
  Events,
  RecoveryPage,
  Home,
  MembersPage,
  NotFoundPage,
  ProfilePage,
  TestPage,
  AdminMembersManagement,
} from "../pages";

export const AppStack = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="adminmembers" element={<AdminMembersManagement />} />
        <Route path="test" element={<TestPage />} />
        <Route path="recovery" element={<RecoveryPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventsItem />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

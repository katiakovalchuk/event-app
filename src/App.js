import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";

import Home from "./components/Home";
import LoginPage from "./pages/manager/login";
import RecoveryPage from "./pages/manager/passwordRecovery";
import ProfilePage from "./pages/user/profile";
import MembersPage from "./pages/manager/membersManagement";
import EventsList from "./pages/manager/events";
import EventsItem from "./pages/manager/event";
import Navbar from "./components/Navbar/Navbar";

import "./App.css";

function App() {
  return (
    <AuthContextProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:id" element={<EventsItem />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;

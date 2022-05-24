import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LoginPage from "./pages/manager/login";
import RecoveryPage from "./pages/manager/passwordRecovery";
import ProfilePage from "./pages/user/profile";
import MembersPage from "./pages/manager/membersManagement";

import "./App.css";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/members" element={<MembersPage />} />
      </Routes>
    </>
  );
}

export default App;

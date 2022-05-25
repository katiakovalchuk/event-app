import { Route, Routes } from "react-router-dom";

import { AuthContextProvider } from "./context/authContext";

import {
  Home,
  LoginPage,
  MembersPage,
  ProfilePage,
  RecoveryPage,
} from "./pages";

import "./App.css";
import Navbar from "./components/Navbar/Navbar";

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
      </Routes>
    </AuthContextProvider>
  );
}

export default App;

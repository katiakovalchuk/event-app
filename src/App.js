import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LoginPage from "./pages/manager/login";
import RecoveryPage from "./pages/manager/passwordRecovery";
import ProfilePage from "./pages/user/profile";
import MembersPage from "./pages/manager/membersManagement";
import {AuthContextProvider} from "./context/authContext";

import "./App.css";

function App() {
    return (
        <AuthContextProvider>
          <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/recovery' element={<RecoveryPage />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/members' element={<MembersPage />} />
          </Routes>
        </AuthContextProvider>
    )
}

export default App;

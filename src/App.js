import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import LoginPage from "./pages/common/login";
import RecoveryPage from "./pages/common/passwordRecovery";
import ProfilePage from "./pages/user/profile";
import MembersPage from "./pages/manager/membersManagement";
import {useUserAuth} from "./context/authContext";

import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    let currUser = localStorage.getItem('user');

    const user = currUser ? JSON.parse(currUser) : null;

    return (
        <Routes>
            <Route path="login" element={<LoginPage/>}/>
            <Route path="recovery" element={<RecoveryPage/>}/>
            <Route>
                <Route path="" element={<ProtectedRoute user={user}/>}>
                    <Route index element={<Home/>}/>
                    <Route path="profile" element={<ProfilePage/>}/>
                    <Route path="members" element={<MembersPage/>}/>
                </Route>
                <Route path='*' element={<div>Not found</div>}/>
            </Route>

            {/*<Route path="/login" element={<LoginPage/>}/>*/}
            {/*<Route path="/recovery" element={<RecoveryPage/>}/>*/}
            {/*<Route>*/}
            {/*    <Route path="/" element={<ProtectedRoute user={user}/>}>*/}
            {/*        <Route index element={<Home/>}/>*/}
            {/*        <Route path="/profile" element={<ProfilePage/>}/>*/}
            {/*        <Route path="/members" element={<MembersPage/>}/>*/}
            {/*    </Route>*/}
            {/*    <Route path='*' element={<div>Not found</div>}/>*/}
            {/*</Route>*/}
        </Routes>
    )
}

export default App;

import {Navigate, Route, Routes} from "react-router-dom";
import {LoginPage, RecoveryPage} from "../pages";

export const AuthStack = () => {
    return (
        <Routes>
            <Route path="login" element={<LoginPage/>}/>
            <Route path="recovery" element={<RecoveryPage/>}/>
            <Route path="*" element={<Navigate to="login"/>}/>
        </Routes>
    )
}

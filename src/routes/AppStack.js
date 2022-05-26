import {Route, Routes} from "react-router-dom";

import Layout from "../components/Layout";
import {Home, MembersPage, NotFoundPage, ProfilePage} from "../pages";

export const AppStack = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="members" element={<MembersPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Route>
        </Routes>
    )
}

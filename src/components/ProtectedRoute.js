import {Navigate, Outlet} from "react-router-dom";
import Navbar from "./Navbar/Navbar";


const ProtectedRoute = ({
                            user,
                            redirectPath = "/login"
                        }) => {
    if (!user) {
        return <Navigate to={redirectPath} replace/>
    }

    return (
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}

export default ProtectedRoute;

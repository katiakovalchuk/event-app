import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({
                            isAllowed,
                            redirectPath = "*",
                            children
                        }) => {
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace/>;
    }

    return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
    isAllowed: PropTypes.bool,
    redirectPath: PropTypes.string,
    children: PropTypes.element
};

export default ProtectedRoute;

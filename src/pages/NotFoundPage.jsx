import {Link} from "react-router-dom";

import "../styles/NotFoundPage.scss";

const NotFoundPage = () => {
    return (
        <>
            <div className="wrapper">
                <div className="page-container">
                    <div className="content">
                        <h2>404</h2>
                        <h4>Oops! Page not found</h4>
                        <p>The page you were looking for doesn&apos;t exist. You may have mistyped the adress or the
                            page may have moved.</p>
                        <Link to="/" className="menu-bars">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;

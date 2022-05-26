import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import {useUserAuth} from "../../context/authContext";

import "./style.scss";

const LoginTemplate = () => {
    const [{email, password}, setCredentials] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const {login} = useUserAuth();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setError("/");
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err);
        }
    }

    const handleEmailChange = e => setCredentials(prev => ({...prev, email: e.target.value}));
    const handlePasswordChange = e => setCredentials(prev => ({...prev, password: e.target.value}));

    return (
        <div className="LoginTemplate d-flex justify-content-center align-items-center w-100 vh-100">
            <div className="LoginTemplate-inner d-flex flex-column flex-md-row col-sm-9 col-xl-7">
                <div className="d-flex flex-column justify-content-center text-center col-md-6 p-5">
                    <h1 className="LoginTemplate-heading fw-bold pb-4">Welcome</h1>
                    <p className="LoginTemplate-desc mx-auto lh-sm">
                        To keep connected with us please login with your personal info
                    </p>
                </div>
                <div className="login-form-outer d-flex flex-column justify-content-center col-md-6 p-5">
                    <form
                        className="login-form d-flex flex-column align-items-center text-center text-white"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="fw-bold mb-4">Login</h2>
                        <input
                            className="login-form-input form-control mt-2 mb-3 rounded-3"
                            type="email"
                            placeholder="Email"
                            required
                            onChange={handleEmailChange}
                        />
                        <input
                            className="login-form-input form-control mb-4 rounded-3"
                            type="password"
                            placeholder="Password"
                            required
                            onChange={handlePasswordChange}
                        />
                        <button className="login-form-btn btn w-100 mt-1 rounded-3" type="submit">Submit</button>
                        <div className="forgot-password text-end w-100 mt-1">
                            <Link className="link-light text-decoration-none" to="/recovery">Forgot password?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginTemplate;

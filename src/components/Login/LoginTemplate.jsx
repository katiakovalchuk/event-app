import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {useDialog} from "../../context/dialogContext";
import {useUserAuth} from "../../context/authContext";
import {getUsers} from "../../store/slices/usersSlice";
import Toast from "../Toast";
import {errMessages} from "./messages";
import {getErrorMessage} from "../../helpers/getErrorMessage";
import "./style.scss";

const LoginTemplate = () => {
    const [{email, password}, setCredentials] = useState({
        email: "",
        password: "",
    });

    const {login} = useUserAuth();
    const users = useSelector(state => state.usersSlice.users);
    const {handleShow, handleClose, updateToastContent} = useDialog();
    const [passwordShown, setPasswordShown] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getUsers());
    }, []);

    useEffect(() => {
        if (error) {
            updateToastContent(
                "Failed to login",
                getErrorMessage(error, errMessages)
            );
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isUserEmail = users.some((user) => user.email === email);
        setError("");
        handleClose();
        if (isUserEmail){
            try {
                await login(email, password);
                navigate("/");
            } catch (err) {
                setError(err.message);
                handleShow();
            }
        } else {
            setError("auth/not-registered");
            handleShow();
        }
    };

    const togglePassword = () => setPasswordShown(!passwordShown);

    const handleEmailChange = (e) =>
        setCredentials((prev) => ({...prev, email: e.target.value}));
    const handlePasswordChange = (e) =>
        setCredentials((prev) => ({...prev, password: e.target.value}));

    return (
        <>
            <Toast/>
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
                            <div className="login-form-password w-100 d-flex justify-content-center position-relative">
                                <input
                                    className="login-form-input form-control mb-4 rounded-3"
                                    type={passwordShown ? "text" : "password"}
                                    placeholder="Password"
                                    required
                                    onChange={handlePasswordChange}
                                />
                                {passwordShown ?
                                    <AiOutlineEyeInvisible
                                        className="LoginTemplate-icon position-absolute border-start rounded-end end-0 p-2"
                                        size={40}
                                        onClick={togglePassword}
                                    />
                                    :
                                    <AiOutlineEye
                                        className="LoginTemplate-icon position-absolute border-start rounded-end end-0 p-2"
                                        size={40}
                                        onClick={togglePassword}
                                    />}
                            </div>
                            <button
                                className="login-form-btn btn w-100 mt-1 rounded-3"
                                type="submit"
                            >
                                Login
                            </button>
                        </form>
                        <div
                            className="forgot-password align-self-center w-100 mt-1 pb-3"
                            onClick={handleClose}
                        >
                            <Link
                                className="d-block text-end link-light text-decoration-none"
                                to="/recovery"
                            >
                                Forgot password?
                            </Link>
                            <Link
                                className="d-block text-end link-light text-decoration-none"
                                to="/loginpasswordless"
                            >
                                Login without password
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginTemplate;

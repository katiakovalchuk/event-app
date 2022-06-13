import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {useUserAuth} from "../../context/authContext";
import {useDialog} from "../../context/dialogContext";
import {getUsers} from "../../store/slices/usersSlice";
import {getErrorMessage} from "../../helpers/getErrorMessage";
import {errMessages} from "./messages";
import Toast from "../Toast";
import "./style.scss";

const LoginPasswordlessTemplate = () => {
    const [{email}, setCredentials] = useState({
        email: "",
    });
    const {handleShow, handleClose, updateToastContent} = useDialog();
    const [error, setError] = useState(null);
    const {sendLink} = useUserAuth();
    const users = useSelector(state => state.usersSlice.users);
    const dispatch = useDispatch();

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
        if (error === "") {
            updateToastContent(
                "Processed successfully",
                "Login link has been sent! Please, check email!"
            );
            handleShow();
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isUserEmail = users.some((user) => user.email === email);
        setError("");
        handleClose();
        if (isUserEmail) {
            try {
                await sendLink(email);
                setCredentials(prev => ({...prev, email: ""}));
            } catch (err) {
                setError(err.message);
            }
        } else {
            setError("auth/not-registered");
            handleShow();
        }
    };

    const handleEmailChange = (e) => setCredentials((prev) => ({...prev, email: e.target.value}));

    return (
        <>
            <Toast />
            <div className="LoginTemplate d-flex justify-content-center align-items-center w-100 vh-100">
                <div className="LoginTemplate-inner d-flex flex-column flex-md-row col-sm-9 col-xl-7">
                    <div className="d-flex flex-column justify-content-center text-center col-md-6 p-5">
                        <h1 className="LoginTemplate-heading fw-bold pb-4">Welcome</h1>
                        <p className="LoginTemplate-desc mx-auto lh-sm">To keep connected with us please login with your
                            personal info</p>
                    </div>
                    <div className="login-form-outer d-flex flex-column justify-content-center col-md-6 p-5">
                        <div>
                            <form className="login-form d-flex flex-column align-items-center text-center text-white"
                                  onSubmit={handleSubmit}>
                                <h2 className="fw-bold mb-4">Login</h2>
                                <input className="login-form-input form-control mt-2 mb-3 rounded-3" type="email"
                                       placeholder="Email" required value={email} onChange={handleEmailChange}/>
                                <button className="login-form-btn btn w-100 mt-1 rounded-3" type="submit">
                                    Login
                                </button>
                            </form>
                            <div className="login-link text-end m-auto w-100 pb-3 mt-2">
                                <Link className="d-block link-light text-decoration-none" to="/login">
                                    Login with password!
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPasswordlessTemplate;

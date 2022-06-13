import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {useUserAuth} from "../../context/authContext";
import {useDialog} from "../../context/dialogContext";
import Toast from "../Toast";
import {getErrorMessage} from "../../helpers/getErrorMessage";
import {errMessages} from "./messages";
import "./style.scss";

const ConfirmEmailTemplate = () => {
    const [{email}, setCredentials] = useState({
        email: "",
    });
    const [error, setError] = useState("");
    const {handleShowToast, handleCloseToast, updateToastContent} = useDialog();
    const {signin} = useUserAuth();
    const navigate = useNavigate();

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
        setError("");
        handleCloseToast();
        try {
            await signin(email, window.location.href);
            navigate("/");
        } catch (err) {
            setError(err.message);
            handleShowToast();
        }
    };

    const handleEmailChange = (e) =>
        setCredentials((prev) => ({...prev, email: e.target.value}));

    return (
        <>
            <Toast />
            <div className="LoginTemplate d-flex justify-content-center align-items-center w-100 vh-100">
                <div className="LoginTemplate-inner d-flex flex-column flex-md-row col-sm-9 col-xl-7">
                    <div className="d-flex flex-column justify-content-center text-center col-md-6 p-5">
                        <h1 className="LoginTemplate-heading fw-bold pb-4">Welcome</h1>
                        <p className="LoginTemplate-desc mx-auto lh-sm">
                            To keep connected with us please confirm your email address
                        </p>
                    </div>
                    <div className="login-form-outer d-flex flex-column justify-content-center col-md-6 p-5">
                        <form
                            className="login-form d-flex flex-column align-items-center text-center text-white"
                            onSubmit={handleSubmit}
                        >
                            <h2 className="fw-bold mb-4">Confirm your email</h2>
                            <input
                                className="login-form-input form-control mt-2 mb-3 rounded-3"
                                type="email"
                                placeholder="Email"
                                required
                                onChange={handleEmailChange}
                            />
                            <button
                                className="login-form-btn btn w-100 mt-1 rounded-3"
                                type="submit"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmEmailTemplate;

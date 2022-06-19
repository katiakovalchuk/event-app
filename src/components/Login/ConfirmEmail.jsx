import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import {useUserAuth} from "../../context/authContext";
import {useDialog} from "../../context/dialogContext";
import {getErrorMessage} from "../../helpers/getErrorMessage";
import {errMessages} from "./messages";
import "./style.scss";

const ConfirmEmailTemplate = () => {
    const [{email}, setCredentials] = useState({
        email: "",
    });
    const {signin, sendResetEmail} = useUserAuth();
    const {notifyError} = useDialog();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signin(email, window.location.href);
            navigate("/");
            await sendResetEmail(email);
        } catch (err) {
            notifyError(getErrorMessage(err.message, errMessages));
        }
    };

    const handleEmailChange = (e) => setCredentials((prev) => ({...prev, email: e.target.value}));

    return (
        <>
            <ToastContainer limit={5}/>
            <div className="LoginTemplate d-flex justify-content-center align-items-center w-100 vh-100">
                <div className="LoginTemplate-inner d-flex flex-column flex-md-row col-sm-9 col-xl-7">
                    <div className="d-flex flex-column justify-content-center text-center col-md-6 p-5">
                        <h1 className="LoginTemplate-heading fw-bold pb-4">Welcome</h1>
                        <p className="LoginTemplate-desc mx-auto lh-sm">To keep connected with us please confirm your
                            email address</p>
                    </div>
                    <div className="login-form-outer d-flex flex-column justify-content-center col-md-6 p-5">
                        <form className="login-form d-flex flex-column align-items-center text-center text-white"
                              onSubmit={handleSubmit}>
                            <h2 className="login-form-heading fw-bold mb-4">Confirm your email</h2>
                            <input className="login-form-input form-control mt-2 mb-3 rounded-3" type="email"
                                   name="email" placeholder="Email" required onChange={handleEmailChange}/>
                            <button className="login-form-btn btn w-100 mt-1 rounded-3" type="submit">
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

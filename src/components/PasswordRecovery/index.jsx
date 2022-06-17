import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IconContext} from "react-icons";
import {FaUserLock} from "react-icons/fa";
import {ToastContainer} from "react-toastify";

import {useUserAuth} from "../../context/authContext";
import {useDialog} from "../../context/dialogContext";
import {getUsers} from "../../store/slices/usersSlice";
import {getErrorMessage} from "../../helpers/getErrorMessage";
import {errMessages} from "../Login/messages";
import "./style.scss";

const PasswordRecovery = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const {handleCloseToast, notifySuccess, notifyError} = useDialog();
    const users = useSelector(state => state.usersSlice.users);
    const {sendResetEmail} = useUserAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUsers());
    }, []);

    useEffect(() => {
        if (error === "") {
            setTimeout(() => {
                navigate("/login");
            }, 7000);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isUserEmail = users.some((user) => user.email === email);
        if (isUserEmail) {
            try {
                await sendResetEmail(email);
                setError("");
                setEmail("");
                notifySuccess("Reset password link has been sent! Please, check email!");
            } catch (err) {
                setError(err.message);
                notifyError(getErrorMessage(err.message, errMessages));
            }
        } else {
            notifyError(getErrorMessage("auth/not-registered", errMessages));
        }
    };

    const handleEmailChange = (e) => setEmail(e.target.value);

    return (
        <>
            <ToastContainer limit={5}/>
            <div className="Recovery d-flex justify-content-center align-items-center w-100 vh-100">
                <div className="Recovery-inner d-flex align-items-center justify-content-center p-5 col-sm-6">
                    <div className="Recovery-content w-100">
                        <div className="pt-5 pb-3 text-center text-white">
                            <IconContext.Provider value={{size: 70}}>
                                <FaUserLock/>
                            </IconContext.Provider>
                        </div>
                        <form
                            className="d-flex flex-column pt-5 px-4 align-items-center text-center text-white"
                            onSubmit={handleSubmit}
                        >
                            <h2 className="Recovery-heading fw-bold mb-5">Forgot Password?</h2>
                            <input
                                className="Recovery-input form-control mt-1 mb-4 rounded-3"
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                                autoComplete="on"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            <button
                                className="Recovery-btn btn w-100 mt-1 mb-2 rounded-3"
                                type="submit"
                            >
                                Send password reset link
                            </button>
                        </form>
                        <div className="text-end px-4 pb-5" onClick={handleCloseToast}>
                            <Link className="link-light text-decoration-none" to="/login">
                                Already have an account? Login!
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PasswordRecovery;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { FaUserLock } from "react-icons/fa";

import Toast from "../Toast";
import { useUserAuth } from "../../context/authContext";
import { useDialog } from "../../context/dialogContext";

import "./style.scss";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const { showToast, handleShowToast, handleCloseToast, updateToastContent } =
    useDialog();
  const { sendResetEmail } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      updateToastContent(error);
      handleShowToast();
    }
    if (error === "") {
      updateToastContent(
        "Processed successfully",
        "Reset password link has been sent! Please, check email!"
      );
      handleShowToast();
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleCloseToast();
    try {
      await sendResetEmail(email);
      setError("");
      setEmail("");
      handleShowToast();
    } catch (err) {
      setError(err.message);
      handleShowToast();
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);

  return (
    <>
      {showToast && <Toast />}
      <div
        className={`Recovery d-flex justify-content-center align-items-center w-100 vh-100 ${
          error === "" ? "d-none" : ""
        }`}
      >
        <div className="Recovery-inner d-flex align-items-center justify-content-center p-5 col-sm-6">
          <div className="Recovery-content w-100">
            <div className="pt-5 pb-3 text-center text-white">
              <IconContext.Provider value={{ size: 70 }}>
                <FaUserLock />
              </IconContext.Provider>
            </div>
            <form
              className="d-flex flex-column pt-5 px-4 align-items-center text-center text-white"
              onSubmit={handleSubmit}
            >
              <h2 className="fw-bold mb-5">Forgot Password?</h2>
              <input
                className="Recovery-input form-control mt-1 mb-4 rounded-3"
                type="email"
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

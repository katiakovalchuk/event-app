import { useEffect, useState } from "react";
import { useUserAuth } from "../../context/authContext";
import { Link } from "react-router-dom";
import "./style.scss";
import { usersCollectionRef } from "../../lib/firestore.collections.js";
import { getDocs } from "firebase/firestore";

const ConfirmTemplate = () => {
  const [{ email }, setCredentials] = useState({
    email: "",
  });
  // eslint-disable-next-line
  const [error, setError] = useState("");
  const { sendLink } = useUserAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    getDocs(usersCollectionRef).then((data) => {
      setUsers(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUserEmail = users.some((user) => user.email === email);
    if (isUserEmail) {
      try {
        await sendLink(email);
      } catch (err) {
        setError(err);
      }
    } else {
      console.log("Sorry. You should first be registered by the admin or manager.");
    }
  };

  const handleEmailChange = (e) => setCredentials((prev) => ({ ...prev, email: e.target.value }));

  return (
    <div className="LoginTemplate d-flex justify-content-center align-items-center w-100 vh-100">
      <div className="LoginTemplate-inner d-flex flex-column flex-md-row col-sm-9 col-xl-7">
        <div className="d-flex flex-column justify-content-center text-center col-md-6 p-5">
          <h1 className="LoginTemplate-heading fw-bold pb-4">Welcome</h1>
          <p className="LoginTemplate-desc mx-auto lh-sm">To keep connected with us please login with your personal info</p>
        </div>
        <div className="login-form-outer d-flex flex-column justify-content-center col-md-6 p-5">
          <form className="login-form d-flex flex-column align-items-center text-center text-white" onSubmit={handleSubmit}>
            <h2 className="fw-bold mb-4">Login</h2>
            <input className="login-form-input form-control mt-2 mb-3 rounded-3" type="email" placeholder="Email" required onChange={handleEmailChange} />
            <button className="login-form-btn btn w-100 mt-1 rounded-3" type="submit">
              Login
            </button>
          </form>
          <div className="text-end pb-5">
            <Link className="link-light text-decoration-none" to="/login">
              Login with password!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTemplate;

import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from "firebase/auth";
import PropTypes from "prop-types";

import {auth} from "../lib/init-firebase";
import {getUsers} from "../store/slices/usersSlice";

const authContext = createContext();

export const AuthContextProvider = ({children}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersSlice.users);
  const [user, setUser] = useState({});

  useEffect(() => {
    dispatch(getUsers());
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  function logout() {
    return signOut(auth).then(() => {
      setUser(null);
      navigate("/login");
    });
  }

  const sendResetEmail = (email) => sendPasswordResetEmail(auth, email);
  const reauthenticate = (user, cred) => reauthenticateWithCredential(user, cred);
  const changePassword = (user, newPassword) => updatePassword(user, newPassword);

  function sendLink(email) {
    return sendSignInLinkToEmail(auth, email, {
      url: "http://localhost:3000/confirm",
      handleCodeInApp: true,
    }).then(() => {
      return true;
    });
  }

  const values = {
    user,
    users,
    login,
    logout,
    changePassword,
    reauthenticate,
    sendLink,
    sendResetEmail,
  };

  return <authContext.Provider value={values}>{children}</authContext.Provider>;
};

export const useUserAuth = () => useContext(authContext);

AuthContextProvider.propTypes = {
  children: PropTypes.element,
};

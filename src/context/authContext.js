import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    onAuthStateChanged,
    sendPasswordResetEmail,
    sendSignInLinkToEmail,
    signInWithEmailAndPassword,
    signInWithEmailLink,
    signOut,
    updatePassword,
    updateEmail,
    reauthenticateWithCredential
} from "firebase/auth";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";

import {auth} from "../lib/init-firebase";
import {usersCollectionRef} from "../lib/firestore.collections.js";
import {getUsers} from "../store/slices/usersSlice";
import PropTypes from "prop-types";

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
    const changePassword = (user, newPassword) => updatePassword(user, newPassword);
    const changeEmail = (user, newEmail) => updateEmail(user, newEmail);
    const reauthenticate = (user, cred) => reauthenticateWithCredential(user, cred);

    function signin(email, code) {
        return signInWithEmailLink(auth, email, code).then((result) => {
            setUser(result.user);

            const isUserEmail = users.some((user) => user.email === email);
            if (!isUserEmail) {
                setDoc(doc(usersCollectionRef, result.user.uid), {
                    name: email,
                    id: result.user.uid,
                    email,
                    userImage:
                        "https://firebasestorage.googleapis.com/v0/b/event-app-98f7d.appspot.com/o/profile-1.png?alt=media&token=6e911220-745f-4fab-918d-497af8aa1566",
                    timeStamp: serverTimestamp(),
                });
            }
            return true;
        });
    }

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
        signin,
        logout,
        changePassword,
        changeEmail,
        sendLink,
        sendResetEmail,
        reauthenticate
    };

    return <authContext.Provider value={values}>{children}</authContext.Provider>;
};

export const useUserAuth = () => useContext(authContext);

AuthContextProvider.propTypes = {
    children: PropTypes.element,
};

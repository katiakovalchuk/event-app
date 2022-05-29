import {createContext, useContext, useEffect, useState} from "react";
import {onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail} from "firebase/auth";
import {auth} from '../firebase-config';

const authContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

    const logout = () => signOut(auth);

    const sendResetEmail = email => sendPasswordResetEmail(auth, email);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => setUser(currentUser));

        return () => unsubscribe();
    }, []);

    return (
        <authContext.Provider value={{user, login, logout, sendResetEmail}}>
            {children}
        </authContext.Provider>
    )
}

export const useUserAuth = () => useContext(authContext);

import {createContext, useContext, useEffect, useState} from "react";
import {onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from '../firebase-config';

const authContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState({});

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

    const logout = () => signOut(auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => setUser(currentUser));

        return () => unsubscribe();
    }, []);

    return (
        <authContext.Provider value={{user, login, logout}}>
            {children}
        </authContext.Provider>
    )
}

export const useUserAuth = () => useContext(authContext);

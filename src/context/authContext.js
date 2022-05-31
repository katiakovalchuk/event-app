import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { getDocs, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  function logout() {
    return signOut(auth).then(() => {
      setUser(null);
      navigate("/loginpasswordless");
    });
  }

  const sendResetEmail = (email) => sendPasswordResetEmail(auth, email);

  function signin(email, code) {
    return signInWithEmailLink(auth, email, code).then((result) => {
      setUser(result.user);

      let isUserEmail = users.some((user) => user.email === email);
      if (!isUserEmail) {
        setDoc(doc(db, "users", result.user.uid), {
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
    console.log("send link");
    return sendSignInLinkToEmail(auth, email, {
      url: "http://localhost:3000/confirm",
      handleCodeInApp: true,
    }).then(() => {
      return true;
    });
  }

  useEffect(() => {
    const getUsers = () => {
      getDocs(collection(db, "users")).then((data) => {
        setUsers(
          data.docs.map((item) => {
            return { ...item.data(), id: item.id };
          })
        );
      });
    };
    getUsers();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const values = {
    user,
    users,
    sendLink,
    signin,
    logout,
    login,
  };

  return <authContext.Provider value={values}>{children}</authContext.Provider>;
};

export const useUserAuth = () => useContext(authContext);

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { getDocs, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
const authContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const navigate = useNavigate();
  const [notesArray, setNotesArray] = useState([]);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  function logOut() {
    return signOut(auth).then(() => {
      setUser(null);
      navigate("/login");
      console.log("signout");
    });
  }

  function sendLink(email, password) {
    return sendSignInLinkToEmail(auth, email, {
      url: "http://localhost:3000/recovery",
      handleCodeInApp: true,
    }).then(() => {
      return true;
    });
  }

  // const checkUsersEmail = async (email) => {
  //   await getDocs(collection(db, "users")).then((snapshot) => {
  //     let users = [];
  //     snapshot.docs.forEach((doc) => {
  //       users.push({ ...doc.data(), id: doc.id });
  //     });
  //     console.log(
  //       "yo1",
  //       users.some((user) => user.email === email)
  //     );
  //     return users.some((user) => user.email === email);
  //   });
  // };

  function signIn(email, code) {
    return signInWithEmailLink(auth, email, code).then((result) => {
      
      setUser(result.user);
      
      let isUserEmail = notesArray.some((user) => user.email === email);
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

  useEffect(() => {
    const getNotes = () => {
      getDocs(collection(db, "users")).then((data) => {
        setNotesArray(
          data.docs.map((item) => {
            return { ...item.data(), id: item.id };
          })
        );
      });
    };
    getNotes();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthenticating(false);
    });

    return () => unsubscribe();
  }, []);

  const values = {
    user,
    isAuthenticating,
    sendLink,
    signIn,
    logOut,
    login,
  };

  return <authContext.Provider value={values}>{!isAuthenticating && children}</authContext.Provider>; // add {!isAuthenticating && children}
};

export const useUserAuth = () => useContext(authContext);

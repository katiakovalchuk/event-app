import { useState, useEffect } from "react";
import { db } from "../lib/init-firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useCollection = (c) => {
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    let colRef = collection(db, c);

    // if (q) {
    //   ref = query(ref, where(...q));
    // }

    // let endQuery;
    // if (select === "all") {
    //   endQuery = query(ref, orderBy("title"));
    // } else {
    //   endQuery = query(ref, orderBy("title"), where("completed", "==", select === "complete"));
    // }

    const unsub = onSnapshot(colRef, (querySnapshot) => {
      let results = [];
      querySnapshot.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });
      
      setDocuments(results);
    });
    return () => unsub();
  }, [c]);

  return { documents };
};

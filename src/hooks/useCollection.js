import { useState, useEffect } from "react";
import { db } from "../lib/init-firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useCollection = (col) => {
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    let colRef = collection(db, col);

    const unsub = onSnapshot(colRef, (querySnapshot) => {
      let results = [];
      querySnapshot.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });

      setDocuments(results);
    });
    return () => unsub();
  }, [col]);

  return { documents };
};

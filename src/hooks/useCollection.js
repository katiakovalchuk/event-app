import { useState, useEffect } from "react";
import { db } from "../lib/init-firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useCollection = (col) => {
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    const colRef = collection(db, col);

    const unsub = onSnapshot(colRef, (querySnapshot) => {
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });

      setDocuments(results);
    });
    return () => unsub();
  }, [col]);

  return { documents };
};

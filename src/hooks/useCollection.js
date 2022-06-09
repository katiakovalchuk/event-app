import { useState, useEffect } from "react";
import { db } from "../lib/init-firebase";
import { collection, query, where, onSnapshot, orderBy, startAt, endAt, getDocs } from "firebase/firestore";

export const useCollection = (col, _query) => {
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    let q;
    if (_query.length > 0) {
      // q = query(collection(db, col), where("fullName", "==", _query));
      // q = query(collection(db, col), orderBy("search", "asc"), startAt(_query), endAt(_query + "\uf8ff"));
      q = query(collection(db, col), orderBy("fullName", "asc"), startAt(_query), endAt(_query + "\uf8ff"));
    } else if (_query.length === 0) {
      q = collection(db, col);
    }

    async function getUsers() {
      const name = query(collection(db, col), where("fullName", "==", _query));
      const company = query(collection(db, col), where("company", "==", _query));
      const phone = query(collection(db, col), where("phoneNumber", "==", _query));

      const querySnapshot1 = await getDocs(name);
      const querySnapshot2 = await getDocs(company);
      const querySnapshot3 = await getDocs(phone);

      const [nameSnapshot, companySnapshot, phoneSnapshot3] = await Promise.all([querySnapshot1, querySnapshot2, querySnapshot3]);

      const oneArray = nameSnapshot.docs;
      const twoArray = companySnapshot.docs;
      const threeArray = phoneSnapshot3.docs;
      const res = oneArray.concat(twoArray).concat(threeArray);
      console.log(res);
      return res;
    }

    if (_query.length > 2) {
      getUsers().then((result) => {
        const results = [];
        result.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setDocuments(results);
      });
    } else {
      const unsub = onSnapshot(q, (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setDocuments(results);
      });
      return () => unsub();
    }
  }, [col, _query]);

  return { documents };
};

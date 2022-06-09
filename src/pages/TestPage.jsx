import React, { useState } from "react";
import { getDocs } from "firebase/firestore";
import { usersCollectionRef } from "../lib/firestore.collections.js";
import { useEffect } from "react";

function TestPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    console.log("useEffect", users);
    setValues();
  }, [users]);

  function setValues() {
    console.log("length", users.length);
    if (users.length > 0) {
      console.log(typeof users);
      console.log("true");
      console.log("setValues", users[1].id);
    }
  }

  function getUsers() {
    getDocs(usersCollectionRef).then((data) => {
      setUsers(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
  }
  return (
    users.length > 0 && (
      <div>
        <button onClick={() => getUsers()}>refresh</button>
        <ul>
          <p>{users[1].id}</p>
          <p>{users.length}</p>
          {users.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      </div>
    )
  );
}

export default TestPage;

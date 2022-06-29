/* eslint-disable react/prop-types */
import React from "react";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { usersCollectionRef } from "../../lib/firestore.collections.js";

const Switch = ({ label, user }) => {
  const { isShowBirthday, email } = user;
  const [checked, setChecked] = useState(isShowBirthday);

  const handleChange = (e) => {
    const { checked } = e.target;
    setChecked(checked);
    const docRef = doc(usersCollectionRef, email);

    updateDoc(docRef, {
      isShowBirthday: checked,
    }).catch((e) => {
      console.error("e", e);
    });
  };

  return (
    <div className="form-check form-switch">
      <input
        checked={checked}
        onChange={handleChange}
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckDefault"
      />
      <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
        {label}
      </label>
    </div>
  );
};

export default Switch;

import React from "react";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { usersCollectionRef } from "../../lib/firestore.collections.js";
// eslint-disable-next-line react/prop-types
const Switch = ({ label, user }) => {
  const [checked, setChecked] = useState(true);
  const handleChange = (e) => {
    const { checked } = e.target;
    setChecked(checked);
    // eslint-disable-next-line react/prop-types
    const docRef = doc(usersCollectionRef, user.email);
    updateDoc(docRef, {
      isShowBirthDay: checked,
    }).then((e) => {
      console.error(e);
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

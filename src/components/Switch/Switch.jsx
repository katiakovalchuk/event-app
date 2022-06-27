import React from "react";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const Switch = ({ label }) => {
  const [checked, setChecked] = useState(true);
  const handleChange = (e) => {
    const { checked } = e.target;
    setChecked(checked);
    console.log(checked);
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

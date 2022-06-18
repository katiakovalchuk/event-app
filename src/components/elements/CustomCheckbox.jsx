import React from "react";
import PropTypes from "prop-types";

import "../../styles/form.scss";

const CustomCheckbox = ({ label, id, register, name, ...props }) => {
  return (
    <div className={`check ${name ? "check-name" : ""}`}>
      <label className="label" htmlFor={id}>
        <input className="check-input" {...register} {...props} />
        <span className="check-style"></span>
        {label}
      </label>
    </div>
  );
};

CustomCheckbox.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  register: PropTypes.object,
  name: PropTypes.bool,
};

export default CustomCheckbox;

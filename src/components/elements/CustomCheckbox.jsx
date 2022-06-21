import React from "react";
import PropTypes from "prop-types";

import "../../styles/form.scss";

const CustomCheckbox = ({ label, id, register, version, ...props }) => {
  return (
    <div className={`check check-${version}`}>
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
  version: PropTypes.string,
};

export default CustomCheckbox;

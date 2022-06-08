import React from "react";
import PropTypes from "prop-types";

import "../../styles/form.scss";

const CustomTextarea = ({ label, register, error, errorText, ...props }) => {
  return (
    <>
      {label && <label className="label form-label">{label}</label>}
      <textarea className="textarea" {...register} {...props} />
      {error && <span className="error-text">{errorText}</span>}
    </>
  );
};

CustomTextarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  register: PropTypes.object,
};

export default CustomTextarea;

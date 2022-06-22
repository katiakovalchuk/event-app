import React from "react";
import PropTypes from "prop-types";

import "../../styles/form.scss";

const CustomTextarea = ({ label, register, error, errorText, ...props }) => {
  return (
    <>
      {label && <label className="form-label">{label}</label>}
      <textarea className="form-control textarea" {...register} {...props} />
      <span className="error-text text-danger">{error && errorText}</span>
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

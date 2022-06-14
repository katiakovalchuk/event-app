import React from "react";

import PropTypes from "prop-types";

import "../../styles/form.scss";

const CustomInput = ({
  label,
  icon,
  version,
  error,
  errorText,
  register,
  show,
  onShowPassword,
  ...props
}) => {
  return (
    <>
      {label && <label className="label form-label">{label}</label>}
      <span className="input-item input-group">
        {icon && <span className="input-icon input-group-text">{icon}</span>}

        <input
          className={`input-input form-control ${version}`}
          {...register}
          {...props}
        />
        {show && (
          <span className="showPassword" onClick={onShowPassword}>
            {show}
          </span>
        )}
      </span>
      {error && <span className="error-text">{errorText}</span>}
    </>
  );
};

CustomInput.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  version: PropTypes.string,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  register: PropTypes.object,
  show: PropTypes.node,
  onShowPassword: PropTypes.func,
};

export default CustomInput;

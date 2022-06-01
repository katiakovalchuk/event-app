import React from "react";

const CustomInput = ({ label, icon, errorText, register, ...props }) => {
  return (
    <>
      {label && <label>{label}</label>}
      <span>
        {icon && icon}
        <input {...register} {...props} />
      </span>
      {errorText && <span>{errorText}</span>}
    </>
  );
};

export default CustomInput;

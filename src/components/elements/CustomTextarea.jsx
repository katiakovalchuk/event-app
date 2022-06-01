import React from "react";

const CustomTextarea = ({ label, errorText, register, ...props }) => {
  return (
    <>
      {label && <label>{label}</label>}
      <textarea {...register} {...props} />
      {errorText && <span>{errorText}</span>}
    </>
  );
};

export default CustomTextarea;

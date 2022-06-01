import React from "react";

const CustomRadio = ({ label, id, errorText, register, ...props }) => {
  return (
    <>
      <input {...register} {...props} />
      {label && <label htmlFor={id}>{label}</label>}

      {errorText && <span>{errorText}</span>}
    </>
  );
};

export default CustomRadio;

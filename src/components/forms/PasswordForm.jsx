import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { RiLockPasswordFill } from "react-icons/ri";
import { BsEyeSlash, BsEye } from "react-icons/bs";

import { CustomInput, CustomButton } from "../elements";
import { passwordSchema } from "../../helpers/schemaForms";

import "../../styles/form.scss";

const PasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(passwordSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const onShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmitPassword = (data) => {
    alert(JSON.stringify(data));
    //your function data.confirmNewPassword
    reset();
  };
  return (
    <form className="form" onSubmit={handleSubmit(onSubmitPassword)}>
      <CustomInput
        label="New password"
        icon={<RiLockPasswordFill />}
        type={showPassword ? "text" : "password"}
        name="newPassword"
        placeholder="New password"
        register={register("newPassword")}
        error={!!errors?.newPassword}
        errorText={errors?.newPassword?.message}
        show={showPassword ? <BsEye size="16px" /> : <BsEyeSlash size="16px" />}
        onShowPassword={onShowPassword}
      />
      <CustomInput
        label="Confirm new password"
        icon={<RiLockPasswordFill />}
        type={showPassword ? "text" : "password"}
        name="confirmNewPassword"
        placeholder="Confirm new password"
        register={register("confirmNewPassword")}
        error={!!errors?.confirmNewPassword}
        errorText={errors?.confirmNewPassword?.message}
        show={showPassword ? <BsEye size="16px" /> : <BsEyeSlash size="16px" />}
        onShowPassword={onShowPassword}
      />
      <CustomButton type="submit" disabled={!isValid}>
        Save Changes
      </CustomButton>
    </form>
  );
};

export default PasswordForm;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EmailAuthProvider } from "firebase/auth";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { yupResolver } from "@hookform/resolvers/yup";

import { CustomButton, CustomInput } from "../elements";
import { useUserAuth } from "../../context/authContext";
import { useDialog } from "../../context/dialogContext";
import { errMessages } from "../Login/messages";
import { passwordSchema } from "../../helpers/schemaForms";
import { getErrorMessage } from "../../helpers/getErrorMessage";

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
  const { user, changePassword, reauthenticate } = useUserAuth();
  const { notifySuccess, notifyError, handleCloseModal } = useDialog();
  const [showPassword, setShowPassword] = useState(false);

  const onShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.oldPassword) {
      try {
        const cred = EmailAuthProvider.credential(user.email, data.oldPassword);
        await reauthenticate(user, cred);
        await changePassword(user, data.newPassword);
        reset();
        notifySuccess("Password has been changed!");
        handleCloseModal();
      } catch (err) {
        notifyError(getErrorMessage(err.message, errMessages));
      }
    } else {
      notifyError("Old password and new password are equal!");
    }
  };
  return (
    <form className="form" onSubmit={handleSubmit(onSubmitPassword)}>
      <div className="position-relative">
        <CustomInput
          label="Old password"
          icon={<RiLockPasswordFill />}
          type={showPassword ? "text" : "password"}
          name="oldPassword"
          placeholder="Old password"
          register={register("oldPassword")}
          error={!!errors?.oldPassword}
          errorText={errors?.oldPassword?.message}
          show={
            showPassword ? (
              <AiOutlineEyeInvisible size="24px" />
            ) : (
              <AiOutlineEye size="24px" />
            )
          }
          onShowPassword={onShowPassword}
        />
      </div>
      <div className="position-relative">
        <CustomInput
          label="New password"
          icon={<RiLockPasswordFill />}
          type={showPassword ? "text" : "password"}
          name="newPassword"
          placeholder="New password"
          register={register("newPassword")}
          error={!!errors?.newPassword}
          errorText={errors?.newPassword?.message}
          show={
            showPassword ? (
              <AiOutlineEyeInvisible size="24px" />
            ) : (
              <AiOutlineEye size="24px" />
            )
          }
          onShowPassword={onShowPassword}
        />
      </div>
      <div className="position-relative">
        <CustomInput
          label="Confirm new password"
          icon={<RiLockPasswordFill />}
          type={showPassword ? "text" : "password"}
          name="confirmNewPassword"
          placeholder="Confirm new password"
          register={register("confirmNewPassword")}
          error={!!errors?.confirmNewPassword}
          errorText={errors?.confirmNewPassword?.message}
          show={
            showPassword ? (
              <AiOutlineEyeInvisible size="24px" />
            ) : (
              <AiOutlineEye size="24px" />
            )
          }
          onShowPassword={onShowPassword}
        />
      </div>
      <CustomButton className="mt-3" type="submit" disabled={!isValid}>
        Save Changes
      </CustomButton>
    </form>
  );
};

export default PasswordForm;

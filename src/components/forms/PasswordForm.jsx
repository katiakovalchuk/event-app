import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {EmailAuthProvider} from "firebase/auth";
import {RiLockPasswordFill} from "react-icons/ri";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {yupResolver} from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import {CustomButton, CustomInput} from "../elements";
import {useUserAuth} from "../../context/authContext";
import {useDialog} from "../../context/dialogContext";
import {errMessages} from "../Login/messages";
import {passwordSchema} from "../../helpers/schemaForms";
import {getErrorMessage} from "../../helpers/getErrorMessage";

import "../../styles/form.scss";

const PasswordForm = ({requestData}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(passwordSchema),
  });
  const {user, reauthenticate} = useUserAuth();
  const {notifyError, addRequireConfirm} = useDialog();
  const [{showOldPassword, showNewPassword, showConfirmPassword}, setShowPassword] = useState({
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const onShowOldPassword = () => {
    setShowPassword((prev) => ({...prev, showOldPassword: !prev.showOldPassword}));
  };
  const onShowNewPassword = () => {
    setShowPassword((prev) => ({...prev, showNewPassword: !prev.showNewPassword}));
  };
  const onShowConfirmPassword = () => {
    setShowPassword((prev) => ({...prev, showConfirmPassword: !prev.showConfirmPassword}));
  };

  const onSubmitPassword = async data => {
    if (data.newPassword !== data.oldPassword) {
      try {
        const cred = EmailAuthProvider.credential(
          user.email,
          data.oldPassword
        );
        await reauthenticate(user, cred);
        requestData(data);
        reset();
        addRequireConfirm();
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
          icon={<RiLockPasswordFill/>}
          type={showOldPassword ? "text" : "password"}
          name="oldPassword"
          placeholder="Old password"
          register={register("oldPassword")}
          error={!!errors?.oldPassword}
          errorText={errors?.oldPassword?.message}
          show={
            showOldPassword ? (
              <AiOutlineEyeInvisible size="24px"/>
            ) : (
              <AiOutlineEye size="24px"/>
            )
          }
          onShowPassword={onShowOldPassword}
        />
      </div>
      <div className="position-relative">
        <CustomInput
          label="New password"
          icon={<RiLockPasswordFill/>}
          type={showNewPassword ? "text" : "password"}
          name="newPassword"
          placeholder="New password"
          register={register("newPassword")}
          error={!!errors?.newPassword}
          errorText={errors?.newPassword?.message}
          show={
            showNewPassword ? (
              <AiOutlineEyeInvisible size="24px"/>
            ) : (
              <AiOutlineEye size="24px"/>
            )
          }
          onShowPassword={onShowNewPassword}
        />
      </div>
      <div className="position-relative">
        <CustomInput
          label="Confirm new password"
          icon={<RiLockPasswordFill/>}
          type={showConfirmPassword ? "text" : "password"}
          name="confirmNewPassword"
          placeholder="Confirm new password"
          register={register("confirmNewPassword")}
          error={!!errors?.confirmNewPassword}
          errorText={errors?.confirmNewPassword?.message}
          show={
            showConfirmPassword ? (
              <AiOutlineEyeInvisible size="24px"/>
            ) : (
              <AiOutlineEye size="24px"/>
            )
          }
          onShowPassword={onShowConfirmPassword}
        />
      </div>
      <CustomButton className="mt-4" type="submit" disabled={!isValid}>
        Save Changes
      </CustomButton>
    </form>
  );
};

export default PasswordForm;

PasswordForm.propTypes = {
  requestData: PropTypes.func,
};

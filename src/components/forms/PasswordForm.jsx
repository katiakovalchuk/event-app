import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {RiLockPasswordFill} from "react-icons/ri";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {yupResolver} from "@hookform/resolvers/yup";

import {CustomButton, CustomInput} from "../elements";
import {useUserAuth} from "../../context/authContext";
import {useDialog} from "../../context/dialogContext";
import {passwordSchema} from "../../helpers/schemaForms";

import "../../styles/form.scss";
import PropTypes from "prop-types";
import {EmailAuthProvider} from "firebase/auth";
import {getErrorMessage} from "../../helpers/getErrorMessage";
import {errMessages} from "../Login/messages";

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
  const [showPassword, setShowPassword] = useState(false);

  const onShowPassword = () => {
    setShowPassword((prev) => !prev);
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
      } catch (err){
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
          type={showPassword ? "text" : "password"}
          name="oldPassword"
          placeholder="Old password"
          register={register("oldPassword")}
          error={!!errors?.oldPassword}
          errorText={errors?.oldPassword?.message}
          show={showPassword ? <AiOutlineEyeInvisible size="24px"/> : <AiOutlineEye size="24px"/>}
          onShowPassword={onShowPassword}
        />
      </div>
      <div className="position-relative">
        <CustomInput
          label="New password"
          icon={<RiLockPasswordFill/>}
          type={showPassword ? "text" : "password"}
          name="newPassword"
          placeholder="New password"
          register={register("newPassword")}
          error={!!errors?.newPassword}
          errorText={errors?.newPassword?.message}
          show={showPassword ? <AiOutlineEyeInvisible size="24px"/> : <AiOutlineEye size="24px"/>}
          onShowPassword={onShowPassword}
        />
      </div>
      <div className="position-relative">
        <CustomInput
          label="Confirm new password"
          icon={<RiLockPasswordFill/>}
          type={showPassword ? "text" : "password"}
          name="confirmNewPassword"
          placeholder="Confirm new password"
          register={register("confirmNewPassword")}
          error={!!errors?.confirmNewPassword}
          errorText={errors?.confirmNewPassword?.message}
          show={showPassword ? <AiOutlineEyeInvisible size="24px"/> : <AiOutlineEye size="24px"/>}
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

PasswordForm.propTypes = {
  requestData: PropTypes.func,
};

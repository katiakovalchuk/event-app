import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { yupResolver } from "@hookform/resolvers/yup";

import { updateAdditionalInfo } from "../../store/slices/usersSlice";

import { CustomInput, CustomTextarea, CustomButton } from "../elements";
import { useDialog } from "../../context/dialogContext";

import "../../styles/form.scss";

const InfoForm = () => {
  const { itemEdit, hideEdit } = useDialog();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    // resolver: yupResolver(),
  });

  useEffect(() => {
    if (itemEdit.edit === true) {
      reset({
        ...itemEdit.item,
      });
    }
  }, [itemEdit]);

  const onSubmitInfo = (data) => {
    dispatch(updateAdditionalInfo(data));
    reset();
    hideEdit();
  };
  return (
    <form className="form" onSubmit={handleSubmit(onSubmitInfo)}>
      <CustomTextarea
        label="Comment"
        name="comment"
        type="text"
        placeholder="Leave a comment"
        register={register("comment")}
        error={!!errors?.comment}
        errorText={errors?.comment?.message}
      />
      <CustomInput
        version="number"
        label="Additional Points"
        name="additionalPoints"
        type="number"
        register={register("additionalPoints")}
        error={!!errors?.addPoints}
        errorText={errors?.addPoints?.message}
      />
      <CustomButton type="submit">Save changes</CustomButton>
    </form>
  );
};

export default InfoForm;

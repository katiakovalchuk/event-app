import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { ToastContainer } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";

import { useDialog } from "../../context/dialogContext";

import { MdEventNote, MdPlace } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";

import { eventSchema } from "../../helpers/schemaForms";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/form.scss";

import { CustomInput, CustomTextarea, CustomButton } from "../elements";
import PropTypes from "prop-types";

const EventForm = ({ requestData }) => {
  const { itemEdit, addRequireConfirm } = useDialog();
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(eventSchema),
  });

  useEffect(() => {
    if (itemEdit.edit === true) {
      reset({
        ...itemEdit.item,
        eventDate: moment(itemEdit.item.eventDate).toDate(),
      });
    }
  }, [itemEdit]);

  const eventPlace = watch("eventPlace");

  return (
    <>
      <ToastContainer limit={5} />

      <form
        className="form"
        autoComplete="off"
        onSubmit={handleSubmit((data) => {
          addRequireConfirm();
          requestData(data);
        })}
      >
        <CustomInput
          label="Event Name"
          icon={<MdEventNote />}
          name="eventName"
          type="text"
          placeholder="Event Name"
          register={register("eventName")}
          error={!!errors?.eventName}
          errorText={errors?.eventName?.message}
        />
        <Controller
          control={control}
          name="eventDate"
          render={({ field }) => (
            <DatePicker
              className="input-input form-control"
              onChange={(date) => field.onChange(date)}
              selected={field.value}
              isClearable
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Choose date and time"
              customInput={
                <CustomInput
                  version="date"
                  label="Date of the Event"
                  icon={<AiOutlineClockCircle />}
                  error={!!errors?.eventDate}
                  errorText={errors?.eventDate?.message}
                />
              }
            />
          )}
        />
        <CustomTextarea
          label="Description of the event"
          name="eventDescription"
          placeholder="Description of the event"
          register={register("eventDescription")}
          error={!!errors?.eventDescription}
          errorText={errors?.eventDescription?.message}
        />
        <h4 className="radio-title mt-2">Please choose venue of the event</h4>
        <label className="label radio-label" htmlFor="online">
          <input
            className="radio-input"
            control={control}
            value="online"
            name="eventPlace"
            id="online"
            {...register("eventPlace")}
            type="radio"
          />
          <span className="radio-style"></span>
          Online
        </label>
        <label className="label radio-label" htmlFor="city">
          <input
            className="radio-input"
            control={control}
            value="city"
            name="eventPlace"
            id="city"
            {...register("eventPlace")}
            type="radio"
          />
          <span className="radio-style"></span>
          City
        </label>

        <span className="error-text text-danger">
          {errors?.eventPlace?.message}
        </span>

        {eventPlace === "city" && (
          <CustomInput
            label="Place of the event"
            icon={<MdPlace />}
            name="cityName"
            type="text"
            placeholder="City Name"
            register={register("cityName")}
            error={!!errors?.cityName}
            errorText={errors?.cityName?.message}
          />
        )}
        <CustomInput
          disabled={itemEdit?.item?.membersList?.length > 0}
          version="number"
          label="Points for the event"
          type="number"
          name="points"
          register={register("points")}
          error={!!errors?.points}
          errorText={errors?.points?.message}
        />
        <CustomButton
          className="my-3"
          type="submit"
          disabled={!(isValid && isDirty)}
        >
          {itemEdit.edit ? "Save changes" : "Add an event"}
        </CustomButton>
      </form>
    </>
  );
};

export default EventForm;

EventForm.propTypes = {
  requestData: PropTypes.func,
};

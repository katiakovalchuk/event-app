import React from "react";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { MdEventNote, MdPlace } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";

import { eventSchema } from "../../helpers/schemaForms";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/form.scss";

import {
  CustomForm,
  CustomInput,
  CustomTextarea,
  CustomCheckbox,
  CustomButton,
} from "../elements";

const EventForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(eventSchema),
  });

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmitEventForm = (data) => {
    console.log(data);
  };

  const hasDescription = watch("hasDescription");
  const eventPlace = watch("eventPlace");

  return (
    <CustomForm onSubmit={handleSubmit(onSubmitEventForm)}>
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
            dateFormat="dd-MM-yyyy HH:mm"
            placeholderText="Choose date and time"
            customInput={
              <CustomInput
                label="Date of the Event"
                icon={<AiOutlineClockCircle />}
              />
            }
          />
        )}
      />
      {errors.eventDate && <span>This field is required</span>}
      <CustomCheckbox
        control={control}
        label="Add description"
        type="checkbox"
        name="hasDescription"
        register={register("hasDescription")}
      />
      {hasDescription && (
        <CustomTextarea
          label="Description of the event"
          name="eventDescription"
          placeholder="Description of the event"
          register={register("eventDescription")}
          error={!!errors?.eventDescription}
          errorText={errors?.eventDescription?.message}
        />
      )}
      <h4 className="radio-title">Please choose venue of the event</h4>
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
        version="number"
        label="Points for the event"
        type="number"
        name="points"
        register={register("points")}
        error={!!errors?.points}
        errorText={errors?.points?.message}
      />
      <CustomButton type="submit">Add an Event</CustomButton>
    </CustomForm>
  );
};

export default EventForm;

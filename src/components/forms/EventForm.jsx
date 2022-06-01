import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { MdEventNote } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";

import { eventSchema } from "../../helpers/schemaForms";

import CustomInput from "../elements/CustomInput";
import CustomTextarea from "../elements/CustomTextarea";
import CustomRadio from "../elements/CustomRadio";

const EventForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(eventSchema),
  });

  const onSubmitEventForm = (data) => {
    console.log(data);
  };

  const hasDescription = watch("hasDescription");
  const eventPlace = watch("eventPlace");
  return (
    <form onSubmit={handleSubmit(onSubmitEventForm)}>
      <CustomInput
        label="Event Name"
        icon={<MdEventNote />}
        name="eventName"
        type="text"
        placeholder="Event Name"
        register={register("eventName")}
        error={!!errors.eventName}
        errorText={errors?.eventName?.message}
      />
      <CustomInput
        label="Date of the Event"
        icon={<AiOutlineClockCircle />}
        name="eventDate"
        type="datetime-local"
        placeholder="Choose date and time"
        register={register("eventDate")}
        error={!!errors.eventDate}
        errorText={errors?.eventDate?.message}
      />
      <CustomInput
        label="Add description"
        type="checkbox"
        name="hasDescription"
        register={register("hasDescription")}
      />
      {hasDescription && (
        <CustomTextarea
          label="Description of the event"
          name="eventDescription"
          register={register("eventDescription")}
          error={!!errors.eventDescription}
          errorText={errors?.eventDescription?.message}
        />
      )}
      <p>Please choose venue of the event</p>
      <CustomRadio
        label="Online"
        type="radio"
        value="online"
        name="eventPlace"
        id="online"
        register={register("eventPlace")}
        error={!!errors.eventPlace}
        errorText={errors?.eventPlace?.message}
      />
      <CustomRadio
        label="City"
        type="radio"
        value="city"
        name="eventPlace"
        id="city"
        register={register("eventPlace")}
        error={!!errors.eventPlace}
        errorText={errors?.eventPlace?.message}
      />
      {/* Add  custom select */}
      {eventPlace === "city" && (
        <select {...register("Title", { required: true })}>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Miss">Miss</option>
          <option value="Dr">Dr</option>
        </select>
      )}
      <CustomInput
        label="Points for the event"
        type="number"
        name="points"
        register={register("points")}
      />

      <button>add</button>
    </form>
  );
};

export default EventForm;

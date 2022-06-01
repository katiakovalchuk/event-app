import * as yup from "yup";

export const eventSchema = yup.object().shape({
  eventName: yup.string().required("Event Name is a required field"),
  eventPlace: yup
    .string()
    .required()
    .oneOf(["online", "city"], "Event Place is a required field"),
});

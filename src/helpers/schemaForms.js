import * as yup from "yup";

export const eventSchema = yup.object().shape({
  eventName: yup
    .string("* Event Name should be a string")
    .required("* Event Name is a required field")
    .matches(
      /^[aA-zZ0-9'-\s]+$/,
      "Only alphabets and numbers are allowed for this field "
    )
    .min(4, "* Min length is 4 characters")
    .max(50, "* Max length is 50 characters"),
  eventDate: yup
    .date()
    .required("* Event Date is a required field")
    .typeError("* Event Date is a required field"),
  hasDescription: yup.bool(),
  eventDescription: yup.string().when("hasDescription", {
    is: true,
    then: yup
      .string()
      .required("* Event Description is a required field")
      .min(20, "* Min length is 20 characters")
      .max(600, "* Max length is 600 characters"),
    otherwise: yup.string().notRequired(),
  }),

    eventPlace: yup
        .string()
        .typeError("* Please choose a venue of the event")
        .required("* Please choose a venue of the event")
        .oneOf(["online", "city"]),

    cityName: yup.string().when("eventPlace", {
        is: "city",
        then: yup
            .string()
            .required("* City Name is a required field")
            .matches(
                /^[aA-zZ0-9'-\s]+$/,
                "Only alphabets and numbers are allowed for this field "
            )
            .min(2, "* Min length is 2 characters")
            .max(50, "* Max length is 50 characters"),
        otherwise: yup.string().notRequired(),
    }),
    points: yup
        .number("* Points should be a positive number")
        .required("* Points is a required field")
        .typeError("* Points is a required field")
        .positive("* Points should be a positive number")
        .integer("* Points should be an integer number"),
});

export const passwordSchema = yup.object().shape({
    oldPassword: yup
        .string()
        .min(6, "* Min length is 6 characters")
        .max(16, "* Max length is 16 characters")
        .required("New password is a required field"),
    newPassword: yup
        .string()
        .min(7, "* Min length is 7 characters")
        .max(16, "* Max length is 16 characters")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/,
            "Password should contain at least 7 characters, including one number and one special character(@,$,!,%,*,#,?,&)"
        )
        .required("New password is a required field"),
    confirmNewPassword: yup
        .string()
        .oneOf(
            [yup.ref("newPassword"), null],
            "This field should match with New password"
        )
        .required("Confirm new password is a required field"),
});

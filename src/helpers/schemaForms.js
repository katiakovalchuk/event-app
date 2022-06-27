import * as yup from "yup";

export const eventSchema = yup.object().shape(
  {
    eventName: yup
      .string("* Event Name should be a string")
      .required("* Event Name is a required field")
      .matches(
        /^[aA-zZ0-9'-\s]+$/,
        "Only alphabets and numbers are allowed for this field "
      )
      .min(4, "* Min length is 4 characters")
      .max(40, "* Max length is 40 characters"),
    eventDate: yup
      .date()
      .required("* Event Date is a required field")
      .typeError("* Event Date is a required field"),

    eventDescription: yup
      .string()
      .nullable()
      .notRequired()
      .when("eventDescription", {
        is: (value) => value?.length,
        then: yup
          .string()
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
      .integer("* Points should be an integer number")
      .min(10, "* Maximum points are 10")
      .max(100, "* Maximum points are 100"),
  },
  [["eventDescription", "eventDescription"]]
);

export const passwordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(6, "* Min length is 6 characters")
    .max(16, "* Max length is 16 characters")
    .required("Old password is a required field"),
  newPassword: yup
    .string()
    .min(7, "* Min length is 7 characters")
    .max(16, "* Max length is 16 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/,
      "* Password should contain number and special character (@,$,!,%,*,#,?,&)"
    )
    .required("New password is a required field"),
  confirmNewPassword: yup
    .string()
    .oneOf(
      [yup.ref("newPassword"), null],
      "* This field should match with New password"
    )
    .required("* Confirm new password is a required field"),
});

export const additinalInfo = yup.object().shape(
  {
    comment: yup
      .string()
      .nullable()
      .notRequired()
      .when("comment", {
        is: (value) => value?.length,
        then: yup
          .string()
          .min(5, "* Min length is 5 characters")
          .max(200, "* Max length is 200 characters"),
        otherwise: yup.string().notRequired(),
      }),
    additionalPoints: yup
      .number()
      .nullable()
      .notRequired()
      .when("additionalPoints", {
        is: (value) => typeof value === "number" && !isNaN(value),
        then: yup
          .number()
          .moreThan(-1)
          .transform((value) => (isNaN(value) ? 0 : value))
          .integer("* Points should be an integer number")
          .max(10, "* Maximum additional points are 10"),
        otherwise: yup
          .number()
          .transform((value) => (isNaN(value) ? 0 : value))
          .notRequired(),
      }),
  },
  [
    ["comment", "comment"],
    ["additionalPoints", "additionalPoints"],
    ["comment", "additionalPoints"],
  ]
);

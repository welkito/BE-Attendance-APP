import * as Yup from "yup"
// import * as Yup from "yup"
import { parse, isDate } from "date-fns";

const today = new Date();

function parseDateString(value, originalValue) {
    const parsedDate = isDate(originalValue)
      ? originalValue
      : parse(originalValue, "yyyy-MM-dd", new Date());
    return parsedDate;
}

export const RegisterValidationSchema = Yup.object({
    salary : Yup.number().required("salary is required"), 
    email : Yup.string().email("Invalid email").required("Email is required")
})

export const LoginValidationSchema = Yup.object({
    password: Yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ), 
    email : Yup.string().required("Email is required").email("Invalid email")
})
// dob : Yup.date().transform(parseDateString).max(today).required("date field is required"),
export const UpdateValidationSchema = Yup.object({
    fullname : Yup.string().required("Employee name is required"), 
    dob : Yup.date().max(today).required("date field is required"),
    password: Yup
    .string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
})
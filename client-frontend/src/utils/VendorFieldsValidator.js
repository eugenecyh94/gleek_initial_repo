import {
  validateEmail,
  validateIsRequired,
  validatePostalCode,
  validatePhoneNumber,
  validatePassword,
  validatePasswordVerify,
} from "./ClientFieldsValidator";
export const validator = (formData, fieldName) => {
  let errors = {};
  switch (fieldName) {
    case "companyName":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "vendorType":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "customCompanyType":
      validateIfCustomCompanyTypeIsRequired(
        formData["vendorType"],
        formData[fieldName],
        errors,
        fieldName,
      );
      break;
    case "vendorDetails":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "companyUEN":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "companyAddress":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "companyEmail":
      validateEmail(formData[fieldName], errors, fieldName);
      break;
    case "companyPostalCode":
      validatePostalCode(formData[fieldName], errors, fieldName);
      break;
    case "companyPhoneNumber":
      validatePhoneNumber(formData[fieldName], errors, fieldName);
      break;
    case "password":
      validatePassword(formData[fieldName], errors, fieldName);
      break;
    case "oldPassword":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "newPassword":
      validatePassword(formData[fieldName], errors, fieldName);
      break;
    case "passwordVerify":
      validatePasswordVerify(
        formData[fieldName],
        formData.password,
        errors,
        fieldName,
      );
      break;
    default:
  }
  return errors;
};

export const validateIfCustomCompanyTypeIsRequired = (
  vendorType,
  data,
  errors,
  fieldName,
) => {
  if (vendorType === "Other") {
    if (data === "") {
      errors[fieldName] = `${fieldName} is required`;
    }
  }
};

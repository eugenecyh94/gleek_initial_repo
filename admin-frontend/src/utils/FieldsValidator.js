export const validator = (formData, fieldName) => {
  let errors = {};
  switch (fieldName) {
    case "name":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "jobTitle":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "team":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "companyName":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "officeAddress":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "billingAddress":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "billingPartyName":
      validateIsRequired(formData[fieldName], errors, fieldName);
      break;
    case "email":
      validateEmail(formData[fieldName], errors, fieldName);
      break;
    case "billingEmail":
      validateEmail(formData[fieldName], errors, fieldName);
      break;
    case "billingOfficePostalCode":
      validatePostalCode(formData[fieldName], errors, fieldName);
      break;
    case "officePostalCode":
      validatePostalCode(formData[fieldName], errors, fieldName);
      break;
    case "phoneNumber":
      validatePhoneNumber(formData[fieldName], errors, fieldName);
      break;
    default:
  }
  return errors;
};

export const validateIsRequired = (data, errors, fieldName) => {
  if (data === "") {
    errors[fieldName] = `${fieldName} is required`;
  }
};

export const validateEmail = (data, errors, fieldName) => {
  if (data === "") {
    errors[fieldName] = `${fieldName} is required`;
  } else {
    const re =
      /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = re.test(String(data).toLowerCase());
    if (!result) errors[fieldName] = "Invalid Email address format!";
  }
};

export const validatePostalCode = (data, errors, fieldName) => {
  if (data === "") {
    errors[fieldName] = `${fieldName} is required`;
  } else {
    const re = /^\d{6}$/;
    const result = re.test(String(data).toLowerCase());
    if (!result) errors[fieldName] = "Invalid Postal Code!";
  }
};

export const validatePhoneNumber = (data, errors, fieldName) => {
  if (data === "") {
    errors[fieldName] = `${fieldName} is required`;
  } else {
    const re = /^65\d{8}$/;
    const result = re.test(String(data).toLowerCase());
    if (!result) errors[fieldName] = "Invalid Phone Number!";
  }
};

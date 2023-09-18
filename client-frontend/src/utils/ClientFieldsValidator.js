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
    case "password":
      validatePassword(formData[fieldName], errors, fieldName);
      break;
    case "passwordVerify":
      validatePasswordVerify(
        formData[fieldName],
        formData.password,
        errors,
        fieldName
      );
      break;
    default:
  }
  return errors;
};

export const validateIsRequired = (data, errors, fieldName) => {
  if (data === "") {
    errors[fieldName] = `${fieldName} is required!`;
  }
};

export const validateEmail = (data, errors, fieldName) => {
  if (data === "") {
    errors[fieldName] = `${fieldName} is required!`;
  } else {
    const re =
      /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = re.test(String(data).toLowerCase());
    if (!result) errors[fieldName] = "Invalid Email address format!";
  }
};

export const validatePostalCode = (data, errors, fieldName) => {
  if (data === "") {
    errors[fieldName] = `${fieldName} is required!`;
  } else {
    const re = /^\d{6}$/;
    const result = re.test(String(data).toLowerCase());
    if (!result) errors[fieldName] = "Invalid Postal Code!";
  }
};

export const validatePhoneNumber = (data, errors, fieldName) => {
  if (data === "") {
    errors[fieldName] = `${fieldName} is required!`;
  } else {
    const re = /^65\d{8}$/;
    const result = re.test(String(data).toLowerCase());
    if (!result) errors[fieldName] = "Invalid Phone Number!";
  }
};

export const validatePassword = (data, errors, fieldName) => {
  if (data === "") {
    errors[fieldName] = `${fieldName} is required!`;
  } else {
    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*/;
    let result = re.test(String(data));
    console.log(result);
    if (!result) {
      errors[fieldName] =
        "Password must contain at least one lower case letter, one \n upper case letter, number and special character.";
      result = false;
    } else if (data.length < 8) {
      errors[fieldName] = "Your password has less than 8 characters.";
      result = false;
    }
  }
};

export const validatePasswordVerify = (data, password, errors, fieldName) => {
  if (password !== data) {
    errors[fieldName] = `Password does not match!`;
  }
};

export const NotificationEvent = {
  BOOKING: "BOOKING",
  ACTIVITY: "ACTIVITY",
  REGISTER: "REGISTER",
  TEST: "TEST", //Testing purposes
};

export const NotificationAction = {
  CREATE: "CREATE", //Activity, Register?
  REQUEST: "REQUEST", //Booking
  UPDATE: "UPDATE", //Activity, Booking
  APPROVE: "APPROVE", //Register (Upon email validation?)
  DISABLED: "DISABLED",
  DELETE: "DELETE",
};

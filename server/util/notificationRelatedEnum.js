export const NotificationEvent = {
  BOOKING: "BOOKING",
  ACTIVITY: "ACTIVITY",
  REGISTER: "REGISTER",
};

export const NotificationAction = {
  CREATE: "CREATE", //Register, Activity
  REQUEST: "REQUEST", //Booking
  UPDATE: "UPDATE", //Activity, Booking
  APPROVE: "APPROVE", //Register, Booking, Activity (Upon email validation?)
  REJECT: "REJECT", //Activity creation?
  DISABLED: "DISABLED",
  DELETE: "DELETE",
};

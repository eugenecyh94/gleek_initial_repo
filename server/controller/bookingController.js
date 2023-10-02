import BookingModel from "../model/bookingModel.js";
import ActivityModel from "../model/activityModel.js";
import ClientModel from "../model/clientModel.js";
import BlockedTimeslotModel from "../model/blockedTimeslotModel.js";

// GET /booking/getAllBookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find();
    // if (bookings.length === 0) {
    //   return res.status(404).json({ message: "No bookings found!" });
    // }
    res.status(200).json({ bookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to get bookings.",
      error: error.message,
    });
  }
};

// GET /booking/getBookingById/:id
export const getBookingById = async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ message: "No booking found with this ID!" });
    }
    res.status(200).json({ booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to get booking.",
      error: error.message,
    });
  }
};

function generateStartTimes(earliestStartTime, latestStartTime, interval) {
  const startTimes = [];
  let currentTime = new Date(earliestStartTime);
  const endTimeObj = new Date(latestStartTime);

  while (currentTime <= endTimeObj) {
    // const hours = currentTime.getHours().toString().padStart(2, "0");
    // const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    startTimes.push(new Date(currentTime));
    currentTime.setTime(currentTime.getTime() + interval * 60 * 1000); // Add interval in milliseconds
  }

  return startTimes;
}

function getTimeslotCapacities(
  startTimes,
  capacity,
  bookings,
  blockedTimeslots,
  duration
) {
  // Create a hashmap to store capacities for each starttime slot
  const capacities = new Map(startTimes.map((slot) => [slot, capacity]));

  // Iterate through blockedTimeslots and update capacities
  for (const blockedTimeslot of blockedTimeslots) {
    const { blockedStartDateTime, blockedEndDateTime } = blockedTimeslot;
    const adjustedBlockedStartDateTime =
      blockedStartDateTime - duration * 60 * 1000; // Adjust for duration

    // Iterate through start times and update capacities
    for (const startTime of startTimes) {
      if (
        startTime > adjustedBlockedStartDateTime &&
        startTime < blockedEndDateTime
      ) {
        // Check if the start time falls within the blockedTimeslot
        capacities.set(startTime, 0);
      }
    }
  }

  // Iterate through bookings and update capacities
  for (const booking of bookings) {
    const { startDateTime, endDateTime } = booking;
    const adjustedStartDateTime = startDateTime - duration * 60 * 1000; // Adjust for duration

    // Iterate through start times and update capacities
    for (const startTime of startTimes) {
      if (startTime >= adjustedStartDateTime && startTime <= endDateTime) {
        // Check if the start time falls within the booking
        capacities.set(startTime, capacities.get(startTime) - 1);
      }
    }
  }

  // Convert capacities back to an array
  const finalCapacities = Array.from(capacities.values());

  return finalCapacities;
}

function generateAllTimeslots(
  earliestStartTime,
  latestStartTime,
  interval,
  capacity,
  bookings,
  blockedTimeslots,
  duration
) {
  const startTimes = generateStartTimes(
    earliestStartTime,
    latestStartTime,
    interval
  );

  const timeslotCapacities = getTimeslotCapacities(
    startTimes,
    capacity,
    bookings,
    blockedTimeslots,
    duration
  );

  const allTimeslots = startTimes.map((startTime, index) => {
    return {
      startTime: startTime,
      endTime: new Date(startTime.getTime() + duration * 60 * 1000),
      isAvailable: timeslotCapacities[index] > 0,
    };
  });

  console.log("Existing bookings on selected day", bookings);
  console.log("Blocked timeslots on selected day: ", blockedTimeslots);
  console.log("All timeslots: ", allTimeslots);

  return allTimeslots;
}

// GET /gleek/client/getAvailableBookingTimeslots/:activityId/:selectedDate
// Eg: /gleek/client/getAvailableBookingTimeslots/60b9b6b9e6b3a83a3c3b3b3b/2023-10-07T00:00:00.000Z
export const getAvailableBookingTimeslots = async (req, res) => {
  try {
    const { activityId, selectedDate } = req.params;
    // Validate that activity exists
    const activity =
      await ActivityModel.findById(activityId).populate("linkedVendor");
    if (activity === null) {
      return res.status(404).json({
        error: "Activity not found with the provided ID.",
        activityId: activityId,
      });
    }
    // Validate date parameter
    const dateParam = new Date(selectedDate);
    if (dateParam.toString() === "Invalid Date") {
      return res.status(400).json({
        error: "Invalid date parameter.",
        selectedDate: selectedDate,
      });
    }

    // Validate that date parameter is within activity's available dates (weekend/weekday)
    const dayOfWeek = dateParam.getDay(); // 0 (Sunday) to 6 (Saturday)
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

    if (!activity.dayAvailabilities.includes("Weekdays") && isWeekday) {
      return res.status(400).json({
        error: "This activity is not available on weekdays.",
        selectedDate: dateParam,
      });
    }

    if (!activity.dayAvailabilities.includes("Weekends") && isWeekend) {
      return res.status(400).json({
        error: "This activity is not available on weekends.",
        selectedDate: dateParam,
      });
    }

    // Validate that date parameter is XX days in advance
    const today = new Date();
    const daysInAdvance = 7;
    const minDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + daysInAdvance
    );
    if (dateParam < minDate) {
      return res.status(400).json({
        error: `Booking can only be made at least ${daysInAdvance} days in advance.`,
        selectedDate: selectedDate,
      });
    }

    // Validate that date parameter is not a public holiday
    // (public holidays are not available for booking)

    // Generate timeslots in 30 min intervals from 9:00 AM to 5:00 PM
    const earliestStartTime = new Date(dateParam);
    earliestStartTime.setUTCHours(9, 0, 0, 0); // 9:00 AM
    const latestStartTime = new Date(dateParam);
    latestStartTime.setUTCHours(17, 0, 0, 0); // 5:00 PM
    const interval = 30; // 30 minutes

    console.log("earliestStartTime: ", earliestStartTime);
    console.log("latestStartTime: ", latestStartTime);

    const startOfDay = new Date(dateParam);
    startOfDay.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00.000 of the selected day

    const endOfDay = new Date(dateParam);
    endOfDay.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59.999 of the selected day

    // Get activity's bookings for the selected date
    const bookings = await BookingModel.find({
      activityId,
      startDateTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    // Get activities blocked timeslots for the selected date
    const blockedTimeslots = await BlockedTimeslotModel.find({
      activityId,
      blockedStartDateTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const allTimeslots = generateAllTimeslots(
      earliestStartTime,
      latestStartTime,
      interval,
      1,
      bookings,
      blockedTimeslots,
      activity.duration
    );

    res.status(200).json({
      allTimeslots,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to get available booking timeslots.",
      error: error.message,
    });
  }
};

// POST /gleek/client/createBooking
// Request body expects (for example):
// {
// "clientId" : "60b9b6b9e6b3a83a3c3b3b3b",
// "activityId" : "60b9b6b9e6b3a83a3c3b3b3b",
// "startDateTime" : "2023-12-04T16:00:00.000Z",
// "endDateTime" : "2023-12-04T17:00:00.000Z",
// "basePricePerPax" : 50,
// "totalPax" : 5,
// "weekendAddOnCost" : 10,
// "onlineAddOnCost" : 0,
// "offlineAddOnCost" : 10,
// "eventLocationType" : "Virtual (online sessions)",
// "additionalComments" : "Test Comments",
// "billingEmail" : "test@test",
// "billingPostalCode" : "123456",
// "billingPartyName" : "Test Party",
// "billingAddress" : "Test Address"
// }

export const createBooking = async (req, res) => {
  try {
    const {
      clientId,
      activityId,
      startDateTime,
      endDateTime,
      basePricePerPax,
      totalPax,
      weekendAddOnCost,
      onlineAddOnCost,
      offlineAddOnCost,
      ...restBody
    } = req.body;

    // Check if client exists and is approved to make bookings
    const client = await ClientModel.findById(clientId);
    if (client === null) {
      return res.status(404).json({
        error: "Client not found with the provided ID.",
      });
    }
    if (client.status !== "APPROVED") {
      return res.status(400).json({
        error: "Client is not approved to make bookings yet.",
      });
    }

    // Check if activity exists
    const activity =
      await ActivityModel.findById(activityId).populate("linkedVendor");

    if (activity === null) {
      return res.status(404).json({
        error: "Activity not found with the provided ID.",
      });
    }

    // Get activity title and vendor name
    const activityTitle = activity.title;
    const vendorName = activity.linkedVendor.companyName;

    // Calculate total cost
    const totalCost =
      basePricePerPax * totalPax +
      weekendAddOnCost +
      onlineAddOnCost +
      offlineAddOnCost;

    // Check if activity is available for booking
    // Generate timeslots in 30 min intervals from 9:00 AM to 5:00 PM
    const selectedStartDateTime = new Date(startDateTime);
    const selectedEndDateTime = new Date(endDateTime);

    console.log("selectedStartDateTime: ", selectedStartDateTime);

    const earliestStartTime = new Date(startDateTime);
    earliestStartTime.setUTCHours(9, 0, 0, 0); // 9:00 AM
    const latestStartTime = new Date(startDateTime);
    latestStartTime.setUTCHours(17, 0, 0, 0); // 5:00 PM
    const interval = 30; // 30 minutes

    console.log("earliestStartTime: ", earliestStartTime);
    console.log("latestStartTime: ", latestStartTime);

    const startOfDay = new Date(startDateTime);
    startOfDay.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00.000 of the selected day

    const endOfDay = new Date(startDateTime);
    endOfDay.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59.999 of the selected day

    // Get activity's bookings for the selected date
    const bookings = await BookingModel.find({
      activityId,
      startDateTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    // Get activities blocked timeslots for the selected date
    const blockedTimeslots = await BlockedTimeslotModel.find({
      activityId,
      blockedStartDateTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const allTimeslots = generateAllTimeslots(
      earliestStartTime,
      latestStartTime,
      interval,
      1,
      bookings,
      blockedTimeslots,
      activity.duration
    );

    // If selected timeslot is not available, return error
    const timeslot = allTimeslots.find(
      (timeslot) =>
        timeslot.startTime.getTime() === selectedStartDateTime.getTime() &&
        timeslot.endTime.getTime() === selectedEndDateTime.getTime()
    );
    console.log("Selected timeslot: ", timeslot);

    if (timeslot === undefined || !timeslot.isAvailable) {
      return res.status(400).json({
        error: `Selected booking timeslot for ${activityTitle} is no longer available. Please book another timeslot!`,
      });
    }

    // Create booking
    const booking = new BookingModel({
      clientId,
      activityId,
      startDateTime,
      endDateTime,
      totalCost,
      totalPax,
      basePricePerPax,
      weekendAddOnCost,
      onlineAddOnCost,
      offlineAddOnCost,
      activityTitle,
      vendorName,
      ...restBody,
    });
    await booking.save();

    // Send email to client, vendor and admin

    res.status(201).json({
      message: `Successfully booked ${activityTitle}! Booking is now pending for confirmation.`,
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to create booking.",
      error: error.message,
    });
  }
};

// DELETE /booking/deleteBooking/:id
export const deleteBooking = async (req, res) => {
  try {
    const booking = await BookingModel.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ message: "No booking found with this ID!" });
    }
    res.status(200).json({ message: "Booking deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to delete booking.",
      error: error.message,
    });
  }
};

// PATCH /booking/confirmBooking/:id
export const confirmBooking = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to confirm booking.",
      error: error.message,
    });
  }
};

// PATCH /booking/rejectBooking/:id
export const rejectBooking = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to reject booking.",
      error: error.message,
    });
  }
};

// PATCH /booking/cancelBooking/:id
export const cancelBooking = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to cancel booking.",
      error: error.message,
    });
  }
};

// PATCH /booking/updateBooking/:id
export const updateBooking = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to update booking.",
      error: error.message,
    });
  }
};

// PATCH /booking/updateToPaid/:id
export const updateToPaid = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to update booking to PAID.",
      error: error.message,
    });
  }
};

// GET /booking/getAllBookingsByClientId/:id
export const getAllBookingsByClientId = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to get bookings by client ID.",
      error: error.message,
    });
  }
};

// GET /booking/getAllBookingsByVendorId/:id
export const getAllBookingsByVendorId = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to get bookings by vendor ID.",
      error: error.message,
    });
  }
};

// GET /booking/getAllBookingsByActivityId/:activityId
export const getAllBookingsByActivityId = async (req, res) => {
  try {
    const { activityId } = req.params;
    const bookings = await BookingModel.find({ activityId });
    res.status(200).json({ bookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error! Unable to get bookings by activity ID.",
      error: error.message,
    });
  }
};

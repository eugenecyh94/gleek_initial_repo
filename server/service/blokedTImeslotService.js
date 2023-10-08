import BlockedTimeslotModel from "../model/blockedTimeslotModel.js";

export const addBlockedTimeslotForActivity = async (
  activityId,
  blockedStartDateTime,
  blockedEndDateTime,
  session,
) => {
  const blockedTimeslot = new BlockedTimeslotModel({
    activityId,
    blockedStartDateTime,
    blockedEndDateTime,
  });
  if (session) {
    const create = await BlockedTimeslotModel.create([blockedTimeslot], session);
    return create[0];
  } else {
    const create = await blockedTimeslot.save();
    return create;
  }
};

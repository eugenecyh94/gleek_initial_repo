import axios from "axios";
import chai, { assert } from "chai";
import chaiHttp from "chai-http";
import { before, describe, it } from "mocha";
import mongoose from "mongoose";
import "../loadEnvironment.js";
import { ActivityDayAvailabilityEnum } from "../util/activityDayAvailabilityEnum.js";
import { LOCATION, THEME, TYPE } from "../util/activityTagEnum.js";
import { PaxIntervalEnum } from "../util/paxIntervalEnum.js";

chai.use(chaiHttp);
const expect = chai.expect;

const uri =
  "mongodb+srv://admin:passwordAceyyy@cluster0.qin7gar.mongodb.net/?retryWrites=true&w=majority";

describe("Activity Model", () => {
  before(async () => {
    await mongoose.connect(uri, {});
    mongoose.connection;
  });
  it("should create a new activity", async () => {
    const newActivityData = {
      title: "Test Title",
      description: "Test Description",
      clientMarkupPercentage: 30,
      maxParticipants: 50,
      theme: {
        name: THEME.SUSTAINABILITY,
        subthemes: ["subtheme1", "subtheme2"],
      },
      dayAvailabilities: [
        ActivityDayAvailabilityEnum.WEEKDAYS,
        ActivityDayAvailabilityEnum.WEEKENDS,
      ],
      activityType: TYPE.TALKS,
      duration: 60,
      location: LOCATION.HYBRID,
      activityPricingRules: [
        {
          paxInterval: PaxIntervalEnum.INTERVAL_1,
          pricePerPax: 50,
        },
        {
          paxInterval: PaxIntervalEnum.INTERVAL_2,
          pricePerPax: 40,
        },
      ],
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/activity/addActivity",
        newActivityData
      );
      assert.equal(response.status, 201);
      expect(response.data.activity).to.be.an("object");
      expect(response.data.activity.title).to.equal("Test Title");
    } catch (error) {
      console.error(error);
    }
  });
  it("should get all activities", async () => {
    try {
      const response = await axios.get("http://localhost:5000/activity/all");
      assert.equal(response.status, 200);
    } catch (error) {
      console.error(error);
    }
  });
  it("should retrieve one activity", async () => {
    const id = "650279ff7fb60db6446810ca";
    try {
      const response = await axios.get(
        `http://localhost:5000/activity/viewActivity/${id}`
      );
      assert.equal(response.status, 200);
    } catch (error) {
      console.error(error);
    }
  });
});

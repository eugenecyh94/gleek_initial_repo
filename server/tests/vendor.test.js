import axios from "axios";
import chai, { assert } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import "../loadEnvironment.js";
import { VendorTypeEnum } from "../util/vendorTypeEnum.js";
import VendorModel from "../model/vendorModel.js";

chai.use(chaiHttp);
const expect = chai.expect;
let db = null;

const uri =
  "mongodb+srv://admin:passwordAceyyy@cluster0.qin7gar.mongodb.net/?retryWrites=true&w=majority";

describe("Vendor Model", () => {
  before(async () => {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  beforeEach(async () => {
    try {
      const res = await VendorModel.deleteMany({ companyUEN: "123456789A" });
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  });

  after(async () => {
    await db.close();
  });

  it("should create a new vendor", async () => {
    const newVendorData = {
      companyName: "Example Company",
      companyUEN: "123456789A",
      companyAddress: "123 Main St",
      companyNumber: 1234567890,
      companyType: VendorTypeEnum.B_CORP,
      customCompanyType: "Custom Type",
      companyEmail: "example@example.com",
      brandNames: ["Brand 1", "Brand 2"],
      vendorDetails: "Some details about the vendor",
      companyLogo: "logo.png",
      companySocials: {
        facebook: "facebook.com/example",
        twitter: "twitter.com/example",
      },
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/vendor/addVendor",
        newVendorData
      );

      assert.equal(response.status, 201);
      expect(response.data).to.be.an("object");
      expect(response.data.companyName).to.equal("Example Company");
    } catch (error) {
      console.error(error);
    }
  });
});

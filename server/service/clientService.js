import Client from "../model/clientModel.js";
import bcrypt from "bcryptjs";

export const clientExists = async (email) => {
  const oldClient = await Client.findOne({ email });
  return !!oldClient;
};

export const createClient = async (newClient, session) => {
  const clientData = {
    email: newClient.email,
    ...newClient,
    signupDate: Date.now(),
    status: "PENDING",
  };
  // Need to pass newClient in an array as we are passing in session
  // See: https://mongoosejs.com/docs/api/model.html#Model.create()
  const create = await Client.create([clientData], { session: session });

  return create[0];
};

export const encryptUserPassword = async (client, password) => {
  const salt = await bcrypt.genSalt(10);
  client.password = await bcrypt.hash(password, salt);
  return client.save();
};

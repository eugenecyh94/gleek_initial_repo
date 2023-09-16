import Client from "../model/clientModel.js";

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    return res.status(200).json(clients);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

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

export const updateClient = async (req, res) => {
  try {
    const updateData = req.body;
    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id },
      { ...updateData, approvedDate: Date.now() },
      { new: true },
    );
    return res.status(201).json(updatedClient);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

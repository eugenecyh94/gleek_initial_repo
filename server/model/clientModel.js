import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

const ClientModel = mongoose.model("Client", clientSchema, "clients");
export default ClientModel;

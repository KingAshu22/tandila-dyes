import mongoose, { Schema, model, models } from "mongoose";

const ServiceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    rate: { type: Number, required: true },
});

const AddOnSchema = new mongoose.Schema({
    type: { type: String, required: true },
    rate: { type: Number, required: true },
});

const ClientSchema = new Schema({
    name: String,
    address: String,
    contact: String,
    code: String,
    password: String,
    services: { type: [ServiceSchema], required: true },
    addOns: { type: [AddOnSchema], required: false },
});

const Client = models.Client || model("Client", ClientSchema);

export default Client;

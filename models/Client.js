import mongoose, { Schema, model, models } from "mongoose";

const ClientSchema = new Schema({
    name: String,
    address: String,
    contact: String,
    code: String,
    password: String,
    services: {
        type: String,
        rate: Number,
    }
});

const Client = models.Client || model("Client", ClientSchema);

export default Client;

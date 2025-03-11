import mongoose, { Schema, model, models } from "mongoose";

const ManagerSchema = new Schema({
    code: String,
    name: String,
    email: String,
    password: String,
})

const Manager = models.Manager || model("Manager", ManagerSchema);

export default Manager;
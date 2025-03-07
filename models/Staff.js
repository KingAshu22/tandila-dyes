import mongoose, { Schema, model, models } from "mongoose";

const StaffSchema = new Schema({
    name: String,
    address: String,
    contact: String,
    designation: String,
    code: String,
    password: String,
})

const Staff = models.Staff || model("Staff", StaffSchema);

export default Staff;
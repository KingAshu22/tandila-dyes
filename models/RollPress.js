import mongoose, { Schema, model, models } from "mongoose";

const RollPressSchema = new Schema({
    batchNo: String,
    date: Date,
    clientCode: String,
    challanNo: String,
    vendorCode: String,
});

const RollPress = models.RollPress || model("RollPress", RollPressSchema);

export default RollPress;

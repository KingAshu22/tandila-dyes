import mongoose, { Schema, model, models } from "mongoose";

const EntriesSchema = new Schema({
    batchNo: String,
    date: Date,
    clientCode: String,
    vrNo: String,
    workOrder: [
        {
            orderNo: String,
            staffCode: String,
            description: String,
            service: String,
            quantity: Number,
            unit: String,
            rate: Number,
            amount: Number,
            inDate: Date,
            outDate: Date,
            remarks: String
        }
    ]
});

const Entry = models.Entry || model("Entry", EntriesSchema);

export default Entry;

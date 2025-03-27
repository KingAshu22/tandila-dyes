import mongoose, { Schema, model, models } from "mongoose";

const InvoicesSchema = new Schema({
    date: Date,
    clientCode: String,
    invoiceNo: String,
    fromDate: Date,
    toDate: Date
});

const Invoice = models.Invoice || model("Invoice", InvoicesSchema);

export default Invoice;

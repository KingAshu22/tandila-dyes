import mongoose, { Schema, model, models } from "mongoose";

const InvoicesSchema = new Schema({
    date: Date,
    clientCode: String,
    invoiceNo: String,
    fromDate: Date,
    toDate: Date,
    paymentReceived: [{
        date: String,
        amount: Number,
        mode: String,
        receivedTo: String,
    }],
    balanceAmount: String,
});

const Invoice = models.Invoice || model("Invoice", InvoicesSchema);

export default Invoice;

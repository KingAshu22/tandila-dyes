import { connectToDB } from "@/app/_utils/mongodb";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";


export async function GET() {
    await connectToDB()

    try {
        const lastInvoice = await Invoice.findOne({}).sort({ _id: -1 }).select("invoiceNo")

        let code
        if (!lastInvoice) {
            // If no invoice exist, start with 0
            code = "0000"
        } else {
            // return the last code
            code = lastInvoice.invoiceNo
        }

        return NextResponse.json({
            code
        })
    } catch (error) {
        console.error("Error fetching Invoice:", error.message)
        return NextResponse.json({ error: "Failed to fetch Invoice" }, { status: 500 })
    }
}

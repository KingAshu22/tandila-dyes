import { connectToDB } from "@/app/_utils/mongodb";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDB();

    try {
        // Fetch the last document for the invoice number
        const lastEntry = await Entry.findOne({}).sort({ _id: -1 }).select("batchNo");

        let batchNo;
        if (!lastEntry) {
            batchNo = "B-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-001";
        } else {
            // Extract the YYYYMMDD part from the batch number
            const lastBatchDateStr = lastEntry.batchNo.slice(2, 10); // Extract YYYYMMDD
            const lastBatchDate = new Date(
                lastBatchDateStr.slice(0, 4) + "-" + lastBatchDateStr.slice(4, 6) + "-" + lastBatchDateStr.slice(6, 8)
            ).toISOString().slice(0, 10);

            const today = new Date().toISOString().slice(0, 10);

            if (lastBatchDate === today) {
                batchNo = "B-" + lastBatchDateStr + "-" + (Number.parseInt(lastEntry.batchNo.slice(-3)) + 1).toString().padStart(3, "0");
            } else {
                batchNo = "B-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-001";
            }
        }

        return NextResponse.json({ batchNo });
    } catch (error) {
        console.error("Error fetching Entry:", error.message);
        return NextResponse.json({ error: "Failed to fetch Entry" }, { status: 500 });
    }
}

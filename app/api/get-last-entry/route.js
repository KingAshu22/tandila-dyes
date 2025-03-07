import { connectToDB } from "@/app/_utils/mongodb";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDB()

    try {
        // Fetch the last document for the invoice number
        const lastEntry = await Entry.findOne({}).sort({ _id: -1 }).select("batchNo")

        let batchNo
        if (!lastEntry) {
            batchNo = "B-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-001"
        } else {
            const date = new Date(lastEntry.batchNo.slice(2)).toISOString().slice(0, 10)
            const today = new Date().toISOString().slice(0, 10)
            if (date === today) {
                batchNo = "B-" + lastEntry.batchNo.slice(2) + "-" + (Number.parseInt(lastEntry.batchNo.slice(-3)) + 1).toString().padStart(3, "0")
            } else {
                batchNo = "B-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-001"
            }
        }

        return NextResponse.json({
            batchNo: batchNo,
        })
    } catch (error) {
        console.error("Error fetching Entry:", error.message)
        return NextResponse.json({ error: "Failed to fetch Entry" }, { status: 500 })
    }
}

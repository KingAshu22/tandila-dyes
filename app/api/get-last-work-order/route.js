import { connectToDB } from "@/app/_utils/mongodb";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDB()

    try {
        // Fetch the last document for the workOrder
        const lastEntry = await Entry.findOne({}).sort({ _id: -1 }).select("workOrder")

        let workOrder
        // my schema for Entry model is like this:
        // batchNo: String,
        //     date: Date,
        //         clientCode: String,
        //             vrNo: String,
        //                 workOrder: [
        //                     {
        //                         orderNo: String,
        //                         description: String,
        //                         quantity: Number,
        //                         unit: String,
        //                         rate: Number,
        //                         amount: Number,
        //                         outDate: Date,
        //                         remarks: String
        //                     }
        //                 ]
        // I want a workOrder in this format WO-250306-001
        // Here 250306 is the date as 06 March 2025 and last 001 is the serial number like WO-250306-001, WO-250306-002 & so on
        // if there is not any workOrder on date 250306 then make the serial number as 001, if there is workOrder on date 250306 with serial number 001 then make the new workOrder with serial number 002 and then return it as the response and the serial number should start again from 001 on next day
        // for eg today is 07 march 2025 then first check for this date in lastWorkOrder, if there is date then add an incremented serial number in it otherwise make the serial number as 001
        if (!lastEntry) {
            workOrder = "WO-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-001"
        } else {
            const date = new Date(lastEntry.workOrder.slice(3)).toISOString().slice(0, 10)
            const today = new Date().toISOString().slice(0, 10)
            if (date === today) {
                workOrder = "WO-" + lastEntry.workOrder.slice(3) + "-" + (Number.parseInt(lastEntry.workOrder.slice(-3)) + 1).toString().padStart(3, "0")
            } else {
                workOrder = "WO-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-001"
            }
        }

        return NextResponse.json({
            workOrder: workOrder,
        })
    } catch (error) {
        console.error("Error fetching Entry:", error.message)
        return NextResponse.json({ error: "Failed to fetch Entry" }, { status: 500 })
    }
}

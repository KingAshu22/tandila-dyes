import { connectToDB } from "@/app/_utils/mongodb";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDB();

    try {
        // Fetch the last document based on `_id` to get the latest workOrder array
        const lastEntry = await Entry.findOne({})
            .sort({ _id: -1 }) // Sorting by `_id` to get the latest entry
            .select("workOrder");

        let workOrder;
        const todayDateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

        if (!lastEntry || !lastEntry.workOrder || lastEntry.workOrder.length === 0) {
            // If no previous work order exists, start from 001
            workOrder = `WO-${todayDateStr}-001`;
        } else {
            console.log("Last Entry:", lastEntry); // Debugging log

            // Get the last workOrder object in the array
            const lastWorkOrderObj = lastEntry.workOrder[lastEntry.workOrder.length - 1];
            const lastWorkOrderNo = lastWorkOrderObj.orderNo;

            // Extract YYYYMMDD part (characters 3-11)
            const lastWorkOrderDateStr = lastWorkOrderNo.slice(3, 11);

            if (lastWorkOrderDateStr === todayDateStr) {
                // Extract the last 3 digits (sequence number) and increment it
                const lastSequence = Number.parseInt(lastWorkOrderNo.slice(-3), 10);
                const newSequence = (lastSequence + 1).toString().padStart(3, "0");
                workOrder = `WO-${todayDateStr}-${newSequence}`;
            } else {
                // If date is different, reset sequence to 001
                workOrder = `WO-${todayDateStr}-001`;
            }
        }

        return NextResponse.json({ workOrder });
    } catch (error) {
        console.error("Error fetching Work Order:", error.message);
        return NextResponse.json({ error: "Failed to fetch Work Order" }, { status: 500 });
    }
}

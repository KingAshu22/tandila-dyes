import { connectToDB } from "@/app/_utils/mongodb";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { clientCode } = await params;
    console.log("Inside get /api/invoice/client/:clientCode");
    await connectToDB();
    try {
        const invoices = await Invoice.find({ clientCode: clientCode });

        if (!invoices) {
            return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
        }

        return NextResponse.json(invoices);
    } catch (error) {
        console.error("Error fetching Invoice data:", error);
        return NextResponse.json(
            { message: "Failed to fetch Invoice data.", error: error.message },
            { status: 500 }
        );
    }
}

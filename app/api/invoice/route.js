import { connectToDB } from "@/app/_utils/mongodb";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function GET(req) {
    console.log("Inside get /api/invoice");
    await connectToDB();

    try {
        // Fetch invoices
        const invoices = await Invoice.find().sort({ _id: -1 });

        return NextResponse.json(invoices);
    } catch (error) {
        console.error("Error fetching Invoices:", error.message);
        return NextResponse.json({ error: "Failed to fetch Invoices" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        console.log("Inside /api/invoice");
        await connectToDB();
        const data = await req.json(); // Parse JSON body from the request

        console.log(data);

        const invoice = new Invoice(data);
        await invoice.save();

        return NextResponse.json(
            { message: "Invoice added successfully!", invoice },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /api/invoice:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

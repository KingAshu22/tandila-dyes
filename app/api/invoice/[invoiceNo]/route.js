import { connectToDB } from "@/app/_utils/mongodb";
import Invoice from "@/models/Invoice";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { invoiceNo } = await params;
    console.log("Inside get /api/invoice/:invoiceNo");
    await connectToDB();
    try {
        const invoice = await Invoice.find({ invoiceNo: invoiceNo });

        if (!invoice) {
            return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
        }

        return NextResponse.json(invoice);
    } catch (error) {
        console.error("Error fetching Invoice data:", error);
        return NextResponse.json(
            { message: "Failed to fetch Invoice data.", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        console.log("Updating Invoice");
        await connectToDB();
        const { invoiceNo } = await params; // Correctly extract params
        const body = await req.json(); // Parse the incoming JSON data

        const updatedInvoice = await Invoice.findOneAndUpdate(
            { invoiceNo }, // Use a proper query object
            body,
            { new: true }
        );

        if (!updatedInvoice) {
            return new Response(JSON.stringify({ message: "Invoice not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(
            JSON.stringify({ message: "Invoice updated successfully!", updatedInvoice }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error updating Invoice data:", error);
        return new Response(
            JSON.stringify({
                message: "Failed to update Invoice data.",
                error: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        console.log("Deleting Invoice");
        await connectToDB();
        const { invoiceNo } = await params; // Correctly extract params
        const deletedInvoice = await Invoice.findOneAndDelete({ invoiceNo }); // Use a proper query object

        if (!deletedInvoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Invoice deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting Invoice data:", error);
        return NextResponse.json(
            { message: "Failed to delete Invoice data." },
            { status: 500 }
        );
    }
}

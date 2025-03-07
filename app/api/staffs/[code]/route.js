import { connectToDB } from "@/app/_utils/mongodb";
import Staff from "@/models/Staff";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { code } = await params;
  console.log("Inside get /api/staffs/:code");
  await connectToDB();
  try {
    const staff = await Staff.find({ code: code });

    if (!staff) {
      return NextResponse.json({ message: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching Staff data:", error);
    return NextResponse.json(
      { message: "Failed to fetch Staff data.", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    console.log("Updating Staff");
    await connectToDB();
    const { code } = await params; // Correctly extract params
    const body = await req.json(); // Parse the incoming JSON data

    const updatedStaff = await Staff.findOneAndUpdate(
      { code }, // Use a proper query object
      body,
      { new: true }
    );

    if (!updatedStaff) {
      return new Response(JSON.stringify({ message: "Staff not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Staff updated successfully!", updatedStaff }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating Staff data:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to update Staff data.",
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
    console.log("Deleting Staff");
    await connectToDB();
    const { code } = await params; // Correctly extract params
    const deletedStaff = await Staff.findOneAndDelete({ code }); // Use a proper query object

    if (!deletedStaff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Staff deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Staff data:", error);
    return NextResponse.json(
      { message: "Failed to delete Staff data." },
      { status: 500 }
    );
  }
}

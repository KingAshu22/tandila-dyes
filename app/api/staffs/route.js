import { connectToDB } from "@/app/_utils/mongodb";
import Staff from "@/models/Staff";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("Inside get /api/staffs");
  await connectToDB();
  try {
    const staffs = await Staff.find({}).sort({ _id: -1 });
    return NextResponse.json(staffs);
  } catch (error) {
    console.error("Error fetching Staffs:", error.message);
    return NextResponse.json({ error: "Failed to fetch Staffs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log("Inside /api/staffs");
    await connectToDB();
    const data = await req.json(); // Parse JSON body from the request

    console.log(data);

    const newStaff = new Staff(data);
    await newStaff.save();

    return NextResponse.json(
      { message: "Staff added successfully!", newStaff },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/staffs:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

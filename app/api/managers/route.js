import { connectToDB } from "@/app/_utils/mongodb";
import Manager from "@/models/Manager";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("Inside get /api/managers");
  await connectToDB();
  try {
    const managers = await Manager.find({}).sort({ _id: -1 });
    return NextResponse.json(managers);
  } catch (error) {
    console.error("Error fetching Clients:", error.message);
    return NextResponse.json({ error: "Failed to fetch Clients" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log("Inside /api/managers");
    await connectToDB();
    const data = await req.json(); // Parse JSON body from the request

    console.log(data);

    const newManager = new Manager(data);
    await newManager.save();

    return NextResponse.json(
      { message: "Manager added successfully!", newManager },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/managers:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

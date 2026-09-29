import { NextResponse } from "next/server";
import menu from "@/data/menu.json";

export async function GET() {
  try {
    return NextResponse.json(menu);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}
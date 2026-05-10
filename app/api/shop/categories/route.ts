import { NextResponse } from "next/server";
import { getService } from "@/services/service-registry";

export async function GET() {
  try {
    const categoryService = getService('categoryService');
    const categories = await categoryService.getAllCategories(true); // force refresh on server
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

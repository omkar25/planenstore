import { NextRequest, NextResponse } from "next/server";
import { getService } from "@/services/service-registry";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    const productService = getService('productService');
    const product = await productService.getProductBySlug(slug);
    return NextResponse.json(product);
  } catch (error) {
    console.error("Product details proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}

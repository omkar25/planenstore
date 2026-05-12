import { NextRequest, NextResponse } from "next/server";
import { getService } from "@/services/service-registry";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    
    const productService = getService('productService');
    const products = await productService.getProducts(page, size);
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error("Products proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

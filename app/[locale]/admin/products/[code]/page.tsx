"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ProductForm from "../product-form";
import { ProductService, Product } from "@/services/product-service";
import { ProductFormValues } from "@/lib/product-schema";
import { AuthTokenService } from "@/services/api-config";

// Helper function to convert Product to ProductFormValues
function productToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category.code, // Use category code for the dropdown
    images: product.images.map(img => img.url), // Convert to URL strings
    imageFiles: [], // No initial files for existing images
    tags: product.tags,
    isPublished: product.published,
    price: product.price,
    listPrice: product.listPrice,
    brand: product.brand,
    countInStock: product.countInStock,
    description: product.description,
    sizes: product.sizes,
    colors: product.colors,
    salesUnit: product.salesUnit || '',
  };
}

export default function EditProductPage() {
  const t = useTranslations('admin.products');
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productCode = params.code as string;

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      console.log('🔒 No session found, redirecting to sign-in');
      router.push("/sign-in");
      return;
    }
    
    console.log('👤 Session found:', { role: session.user?.role, email: session.user?.email });
    
    if (session.user?.role !== "SUPER ADMIN") {
      console.log('❌ Access denied. User role:', session.user?.role, 'Required: SUPER ADMIN');
      router.push("/");
      return;
    }
    
    // Ensure token is stored for API calls
    if (session.user && (session.user as { token?: string }).token) {
      const token = (session.user as { token?: string }).token;
      if (token) {
        AuthTokenService.setToken(token);
        console.log('🔑 Token stored for API calls:', `***TOKEN_START: ${token.substring(0, 50)}...`);
      }
    } else {
      console.warn('⚠️ No token found in session user object');
    }
    
    console.log('✅ Authentication successful for edit page');
  }, [session, status, router]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productCode) {
        setError(t('edit.codeRequired'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`📦 Fetching product with code: ${productCode}`);
        const fetchedProduct = await ProductService.getProductByCode(productCode);
        console.log("📦 Product fetched successfully:", fetchedProduct);
        setProduct(fetchedProduct);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(t('edit.loadError'));
      } finally {
        setLoading(false);
      }
    };

    if (session && productCode) {
      fetchProduct();
    }
  }, [session, productCode, t]);

  // Handle form submission
  const handleSubmit = async (values: ProductFormValues, imageFiles: File[]) => {
    try {
      console.log("🔄 Updating product with values:", values);
      console.log("🖼️ New image files:", imageFiles);

      await ProductService.updateProductWithImages(productCode, values, imageFiles);
      
      toast.success(t('edit.updateSuccess'));

      // Redirect back to products list
      router.push("/admin/products");
      
      return { success: true, message: t('edit.updateSuccess') };
    } catch (error) {
      console.error("Failed to update product:", error);
      const errorMessage = error instanceof Error ? error.message : t('edit.updateError');
      
      toast.error(errorMessage);
      
      return { success: false, message: errorMessage };
    }
  };

  // Show loading state
  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('edit.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || t('edit.notFound')}</p>
            <Button onClick={() => router.push("/admin/products")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToProducts')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/admin/products")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('backToProducts')}
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold">{t('editProduct')}</h1>
          <p className="text-gray-600 mt-2">
            {t('edit.updateInfo')}: <span className="font-medium">{product.name}</span>
          </p>
          <p className="text-sm text-gray-500">{t('edit.productCode')}: {product.code}</p>
        </div>
      </div>

      <ProductForm
        mode="update"
        initialData={productToFormValues(product)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

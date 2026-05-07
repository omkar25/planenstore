'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import ProductForm from '../product-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductService from '@/services/product-service';
import { ProductFormValues } from '@/lib/product-schema';

export default function CreateProductPage() {
  const t = useTranslations('admin.products');
  const { data: session, status } = useSession();
  const router = useRouter();

  // Client-side product creation function
  const createProduct = async (values: ProductFormValues, imageFiles: File[]) => {
    try {
      // Ensure slug is set (use form value or auto-generate)
      const productData: ProductFormValues = {
        ...values,
        slug: values.slug || values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        images: [], // Empty for new products
        imageFiles: [], // This is just for form validation
      };
      
      // Check if we have a valid session before making API call
      if (!session?.user?.token) {
        throw new Error('No authentication token available. Please sign in again.');
      }
      
      // Use the ProductService to create the product with images
      await ProductService.createProductWithImages(productData, imageFiles);
      
      toast.success(t('create.success'));
      
      // Redirect to product list page after successful creation
      router.push('/admin/products');
      
      return { 
        success: true, 
        message: t('create.success')
      };
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error instanceof Error ? error.message : t('create.error');
      toast.error(errorMessage);
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  // Show loading while session is being fetched
  if (status === 'loading') {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('create.title')}</CardTitle>
          <CardDescription>
            {t('create.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm onSubmit={createProduct} />
        </CardContent>
      </Card>
    </div>
  );
}

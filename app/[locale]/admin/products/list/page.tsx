'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ProductList from '../product-list';

export default function ProductListPage() {
  const t = useTranslations('admin.products');
  const { status } = useSession();
  const router = useRouter();

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
      <ProductList />
    </div>
  );
}

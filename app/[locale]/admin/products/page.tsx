'use client';

import { useTranslations } from 'next-intl';
import ProductList from './product-list';

export default function ProductsPage() {
  const t = useTranslations('admin.products');
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-gray-500">{t('subtitle')}</p>
      </div>
      <ProductList />
    </div>
  );
}

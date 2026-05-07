'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import CategoryList from './category-list';
import { Category } from '@/services/category-service';

export default function CategoryPage() {
  const t = useTranslations();
  const { status } = useSession();
  const router = useRouter();

  // Handle category actions
  const handleView = (category: Category) => {
    toast.info(t('admin.categories.viewingCategory', { name: category.name }));
    // TODO: Navigate to view page or open view modal
    // router.push(`/admin/categories/${category.code}`);
  };

  const handleAdd = () => {
    // CategoryList handles this via the form
  };

  const handleDelete = () => {
    // Handled by CategoryList
  };

  // Show loading while session is being fetched
  if (status === 'loading') {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('admin.categories.loading')}</p>
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
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/admin/overview')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('admin.categories.backToDashboard')}
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold">{t('admin.categories.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('admin.categories.pageDescription')}
          </p>
        </div>
      </div>

      <CategoryList
        onView={handleView}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
    </div>
  );
}
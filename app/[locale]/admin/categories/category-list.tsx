'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { CategoryService, Category } from '@/services/category-service';
import { AuthTokenService } from '@/services/api-config';
import CategoryForm from './category-form';

interface CategoryListProps {
  onDelete?: (categoryCode: string) => void;
  onView?: (category: Category) => void;
  onAdd?: () => void;
}

export default function CategoryList({ onDelete, onView, onAdd }: CategoryListProps) {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedCategories = await CategoryService.getAllCategories();
      setCategories(fetchedCategories);
      setFilteredCategories(fetchedCategories);
    } catch {
      toast.error(t('admin.categories.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Store token for API calls when session is available
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const token = (session.user as { token?: string }).token;
      if (token) {
        AuthTokenService.setToken(token);
      }
    }
  }, [session, status]);

  // Initial data fetch
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCategories();
    }
  }, [status, fetchCategories]);

  // Filter categories based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.subCategories?.some(sub => 
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  // Handle create category
  const handleCreateCategory = () => {
    setShowCreateForm(true);
  };

  // Handle successful category creation
  const handleCategoryCreated = () => {
    // Refresh the categories list
    fetchCategories();
  };

  // Handle edit category
  const handleEditCategory = async (category: Category) => {
    try {
      // Check if we have a valid code
      if (!category.code) {
        toast.error(t('admin.categories.codeMissing'));
        return;
      }
      
      const fullCategoryData = await CategoryService.getCategoryByCode(category.code);
      setEditingCategory(fullCategoryData);
      setShowEditForm(true);
      
    } catch (error) {
      toast.error(`${t('admin.categories.loadCategoryError')}: ${error instanceof Error ? error.message : ''}`);
    }
  };

  // Handle successful category update
  const handleCategoryUpdated = () => {
    // Refresh the categories list
    fetchCategories();
    // Note: Success toast is already shown by CategoryForm, so no need to show another one here
    // Clear editing state
    setEditingCategory(null);
  };

  // Handle delete category
  const handleDelete = async (categoryCode: string) => {
    try {
      await CategoryService.deleteCategory(categoryCode);
      
      toast.success(t('admin.categories.deleteSuccess'));
      
      // Refresh the categories list
      await fetchCategories();
      
      // Call parent handler if provided
      onDelete?.(categoryCode);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('admin.categories.deleteError');
      toast.error(errorMessage);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect, so this just prevents form submission
  };

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.categories.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/sign-in');
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.categories.title')}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t('admin.categories.subtitle')}
            </p>
          </div>
          <Button onClick={handleCreateCategory} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('admin.categories.addCategory')}
          </Button>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.categories.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setSearchQuery('')}
            >
              {t('admin.categories.clear')}
            </Button>
          )}
        </form>
      </CardHeader>
      
      <CardContent>
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              {searchQuery ? t('admin.categories.noResults', { query: searchQuery }) : t('admin.categories.noCategories')}
            </div>
            <Button onClick={() => onAdd?.()} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              {t('admin.categories.createFirst')}
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableCaption>
                {searchQuery ? t('admin.categories.searchResults', { query: searchQuery }) : t('admin.categories.listCaption')}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.categories.tableCode')}</TableHead>
                  <TableHead>{t('admin.categories.tableName')}</TableHead>
                  <TableHead>{t('admin.categories.tableSubcategories')}</TableHead>
                  <TableHead>{t('admin.categories.tableProducts')}</TableHead>
                  <TableHead className="text-right">{t('admin.categories.tableActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.code}>
                    <TableCell>
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {category.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {category.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {category.subCategories && category.subCategories.length > 0 ? (
                          category.subCategories.map((subCategory, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subCategory.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">{t('admin.categories.noSubcategories')}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const count = category.productCount || 0;
                        const handleProductCountClick = () => {
                          if (count > 0) {
                            router.push(`/admin/products?category=${encodeURIComponent(category.code)}`);
                          }
                        };
                        
                        const productText = t('admin.categories.products', { count });
                        const titleText = t('admin.categories.viewProducts', { count, name: category.name });
                        
                        const getColorClass = () => {
                          if (count === 0) return "bg-gray-100 text-gray-600 border-gray-300";
                          if (count <= 5) return "bg-blue-100 text-blue-700 border-blue-300 cursor-pointer hover:bg-blue-200";
                          if (count <= 20) return "bg-green-100 text-green-700 border-green-300 cursor-pointer hover:bg-green-200";
                          if (count <= 50) return "bg-orange-100 text-orange-700 border-orange-300 cursor-pointer hover:bg-orange-200";
                          return "bg-purple-100 text-purple-700 border-purple-300 cursor-pointer hover:bg-purple-200";
                        };
                        
                        return (
                          <Badge 
                            variant="outline" 
                            className={`${getColorClass()} transition-colors`}
                            onClick={count > 0 ? handleProductCountClick : undefined}
                            title={count > 0 ? titleText : undefined}
                          >
                            {productText}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView?.(category)}
                          className="hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                          className="hover:bg-green-50"
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-red-50">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('admin.categories.deleteTitle')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('admin.categories.deleteDescription', { name: category.name })}
                                {category.subCategories && category.subCategories.length > 0 && (
                                  <span className="block mt-2 text-orange-600">
                                    {t('admin.categories.deleteWarning', { count: category.subCategories.length })}
                                  </span>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('admin.categories.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(category.code)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t('admin.categories.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Summary */}
            <div className="mt-4 text-sm text-muted-foreground text-center">
              {t('admin.categories.showing', { filtered: filteredCategories.length, total: categories.length })}
            </div>
          </>
        )}
      </CardContent>
      
      {/* Category Creation Form */}
      <CategoryForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSuccess={handleCategoryCreated}
        mode="create"
      />
      
      {/* Category Edit Form */}
      <CategoryForm
        open={showEditForm}
        onOpenChange={(open) => {
          setShowEditForm(open);
          if (!open) {
            setEditingCategory(null);
          }
        }}
        onSuccess={handleCategoryUpdated}
        mode="edit"
        initialData={editingCategory || undefined}
      />
    </Card>
  );
}

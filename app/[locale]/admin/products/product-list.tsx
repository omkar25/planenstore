"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ProductService, Product, ProductsResponse } from '@/services/product-service';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Package
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductListProps {
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onView?: (product: Product) => void;
  onAdd?: () => void;
}

export default function ProductList({ onEdit, onDelete, onView, onAdd }: ProductListProps) {
  const t = useTranslations('admin.products');
  const { status } = useSession();
  const router = useRouter();

  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async (page: number = 0, search: string = '') => {
    try {
      setLoading(true);
      let response: ProductsResponse;
      
      if (search.trim()) {
        setIsSearching(true);
        response = await ProductService.searchProducts(search, page, pageSize);
      } else {
        setIsSearching(false);
        response = await ProductService.getProducts(page, pageSize);
      }
      
      setProducts(response.content || []);
      setTotalProducts(response.totalElements || 0);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial load
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProducts(0);
    }
  }, [status, fetchProducts]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(0, searchQuery);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchProducts(currentPage - 1, searchQuery);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchProducts(currentPage + 1, searchQuery);
    }
  };

  // Handle actions

  const handleDelete = async (productId: string) => {
    if (onDelete) {
      onDelete(productId);
    } else {
      try {
        await ProductService.deleteProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts(currentPage, searchQuery);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product. Please try again.');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };


  if (status === 'loading') {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('title')}
            </CardTitle>
            <CardDescription>
              {t('subtitle')}
              {totalProducts > 0 && (
                <span className="ml-2">
                  ({t('productCount', { count: totalProducts })})
                </span>
              )}
            </CardDescription>
          </div>
          <Button onClick={() => router.push('/admin/products/create')}>
            <Plus className="h-4 w-4 mr-2" />
            {t('addProduct')}
          </Button>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline">
            {t('search')}
          </Button>
          {isSearching && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                setSearchQuery('');
                fetchProducts(0);
              }}
            >
              {t('clear')}
            </Button>
          )}
        </form>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isSearching ? t('noProductsFound') : t('noProductsYet')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {isSearching 
                ? t('noProductsFoundDesc')
                : t('noProductsYetDesc')
              }
            </p>
            {!isSearching && (
              <Button onClick={() => onAdd ? onAdd() : router.push('/admin/products/create')}>
                <Plus className="h-4 w-4 mr-2" />
                {t('createProduct')}
              </Button>
            )}
          </div>
        ) : (
          <>
            <Table>
              <TableCaption>
                {isSearching ? t('searchResults', { query: searchQuery }) : t('listCaption')}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tableCode')}</TableHead>
                  <TableHead>{t('tableProduct')}</TableHead>
                  <TableHead>{t('tableBrand')}</TableHead>
                  <TableHead>{t('tableCategory')}</TableHead>
                  <TableHead>{t('tablePrice')}</TableHead>
                  <TableHead>{t('tableStock')}</TableHead>
                  <TableHead>{t('tableTags')}</TableHead>
                  <TableHead>{t('tableSizes')}</TableHead>
                  <TableHead>{t('tableColors')}</TableHead>
                  <TableHead>{t('tableStatus')}</TableHead>
                  <TableHead>{t('tableCreated')}</TableHead>
                  <TableHead className="text-right">{t('tableActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id || product.code || `product-${index}`}>
                    <TableCell>
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {product.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <Image 
                            src={product.images[0].url} 
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div 
                            className="font-medium truncate cursor-help max-w-[200px]" 
                            title={product.name}
                          >
                            {product.name}
                          </div>
                          <div 
                            className="text-sm text-muted-foreground truncate max-w-[200px]"
                            title={product.slug}
                          >
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatPrice(product.price)}</div>
                        {product.listPrice && product.listPrice > product.price && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.listPrice)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          product.countInStock === 0 
                            ? "bg-gray-100 text-gray-800 border-gray-300"
                            : product.countInStock < 5 
                            ? "bg-red-100 text-red-800 border-red-300"
                            : product.countInStock <= 20 
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-green-100 text-green-800 border-green-300"
                        }
                      >
                        {product.countInStock === 0 
                          ? t('outOfStock') 
                          : t('inStock', { count: product.countInStock })
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {product.tags && product.tags.length > 0 ? (
                          product.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">{t('noTags')}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {product.sizes && product.sizes.length > 0 ? (
                          product.sizes.map((size, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                              {size}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">{t('noSizes')}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {product.colors && product.colors.length > 0 ? (
                          product.colors.map((color, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <div 
                                className="w-3 h-3 rounded-full border border-gray-300" 
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                              ></div>
                              <Badge variant="outline" className="text-xs px-2 py-1">
                                {color}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">{t('noColors')}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.published ? "default" : "secondary"}>
                        {product.published ? t('published') : t('draft')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView ? onView(product) : router.push(`/admin/products/${product.code}`)}
                          className="hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit ? onEdit(product) : router.push(`/admin/products/${product.code}`)}
                          className="hover:bg-green-50"
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('deleteDescription', { name: product.name })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.code)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t('delete')}
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  {t('showing', { from: currentPage * pageSize + 1, to: Math.min((currentPage + 1) * pageSize, totalProducts), total: totalProducts })}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t('previous')}
                  </Button>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">
                      {t('pageOf', { current: currentPage + 1, total: totalPages })}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                  >
                    {t('next')}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

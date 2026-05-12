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
  Package,
  Tag,
  Ruler,
  Palette
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
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async (page: number = 0, search: string = '', size: number = pageSize) => {
    try {
      setLoading(true);
      let response: ProductsResponse;
      
      if (search.trim()) {
        setIsSearching(true);
        response = await ProductService.searchProducts(search, page, size);
      } else {
        setIsSearching(false);
        response = await ProductService.getProducts(page, size);
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
    const formattedNumber = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
    
    return `€ ${formattedNumber}`;
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
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">{t('tableProduct')}</TableHead>
                    <TableHead className="w-[90px]">{t('tableCategory')}</TableHead>
                    <TableHead className="w-[90px]">{t('tablePrice')}</TableHead>
                    <TableHead className="w-[50px] text-center">{t('tableStock')}</TableHead>
                    <TableHead>{t('tableAttributes')}</TableHead>
                    <TableHead className="w-[85px]">{t('tableStatus')}</TableHead>
                    <TableHead className="w-[80px] text-right">{t('tableActions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={product.id || product.code || `product-${index}`}>
                      {/* Product Info - Combined Code, Image, Name */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product.images && product.images.length > 0 ? (
                            <Image 
                              src={product.images[0].url} 
                              alt={product.name}
                              width={36}
                              height={36}
                              className="h-9 w-9 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded bg-muted flex items-center justify-center shrink-0">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div 
                              className="font-medium text-sm truncate max-w-[120px]" 
                              title={product.name}
                            >
                              {product.name}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span className="font-mono bg-muted px-1 rounded">{product.code}</span>
                              <span>•</span>
                              <span>{product.brand}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span className="text-sm">{product.category.name}</span>
                      </TableCell>

                      {/* Price with Sales Unit */}
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {formatPrice(product.price)}{product.salesUnit && ` / ${product.salesUnit}`}
                          </div>
                          {product.listPrice && product.listPrice > product.price && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatPrice(product.listPrice)}{product.salesUnit && ` / ${product.salesUnit}`}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Stock */}
                      <TableCell className="text-center">
                        <Badge 
                          className={`text-xs ${
                            product.countInStock === 0 
                              ? "bg-gray-100 text-gray-800 border-gray-300"
                              : product.countInStock < 5 
                              ? "bg-red-100 text-red-800 border-red-300"
                              : product.countInStock <= 20 
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-green-100 text-green-800 border-green-300"
                          }`}
                        >
                          {product.countInStock}
                        </Badge>
                      </TableCell>

                      {/* Attributes - Tags, Sizes, Colors combined */}
                      <TableCell>
                        <div className="space-y-1.5">
                          {/* Tags */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="flex items-start gap-1.5">
                              <Tag className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                              <div className="flex flex-wrap gap-1">
                                {product.tags.map((tag, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant="outline" 
                                    className="text-[11px] px-2 py-0.5 whitespace-nowrap"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Sizes */}
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="flex items-start gap-1.5">
                              <Ruler className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                              <div className="flex flex-wrap gap-1">
                                {product.sizes.map((size, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant="secondary" 
                                    className="text-[11px] px-2 py-0.5 whitespace-nowrap"
                                  >
                                    {size}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Colors */}
                          {product.colors && product.colors.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Palette className="h-3 w-3 text-muted-foreground shrink-0" />
                              <div className="flex flex-wrap gap-1">
                                {product.colors.map((color, idx) => {
                                  const colorMap: Record<string, string> = {
                                    'weiss': '#ffffff', 'weiß': '#ffffff', 'white': '#ffffff',
                                    'schwarz': '#000000', 'black': '#000000',
                                    'rot': '#ef4444', 'red': '#ef4444',
                                    'grün': '#22c55e', 'gruen': '#22c55e', 'green': '#22c55e',
                                    'blau': '#3b82f6', 'blue': '#3b82f6',
                                    'gelb': '#eab308', 'yellow': '#eab308',
                                    'orange': '#f97316',
                                    'grau': '#6b7280', 'grey': '#6b7280', 'gray': '#6b7280',
                                    'braun': '#92400e', 'brown': '#92400e',
                                    'transparent': 'transparent',
                                    'natur': '#f5f5dc', 'beige': '#f5f5dc',
                                  };
                                  const bgColor = colorMap[color.toLowerCase()] || color.toLowerCase();
                                  const isLight = ['weiss', 'weiß', 'white', 'gelb', 'yellow', 'transparent', 'natur', 'beige'].includes(color.toLowerCase());
                                  
                                  return (
                                    <div 
                                      key={idx}
                                      className="flex items-center gap-0.5"
                                      title={color}
                                    >
                                      <div 
                                        className={`w-3 h-3 rounded-full border ${isLight ? 'border-gray-400' : 'border-gray-300'}`}
                                        style={{ 
                                          backgroundColor: bgColor,
                                          backgroundImage: bgColor === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : undefined,
                                          backgroundSize: bgColor === 'transparent' ? '4px 4px' : undefined,
                                          backgroundPosition: bgColor === 'transparent' ? '0 0, 0 2px, 2px -2px, -2px 0px' : undefined,
                                        }}
                                      />
                                      <span className="text-[10px] text-muted-foreground">{color}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {(!product.tags || product.tags.length === 0) && 
                           (!product.sizes || product.sizes.length === 0) && 
                           (!product.colors || product.colors.length === 0) && (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge 
                          variant={product.published ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {product.published ? t('published') : t('draft')}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-50"
                            onClick={() => onView ? onView(product) : router.push(`/admin/products/${product.code}`)}
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-green-50"
                            onClick={() => onEdit ? onEdit(product) : router.push(`/admin/products/${product.code}`)}
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-50"
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
            </div>
            
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {t('showing', { from: currentPage * pageSize + 1, to: Math.min((currentPage + 1) * pageSize, totalProducts), total: totalProducts })}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('rowsPerPage')}:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const newSize = Number(e.target.value);
                      setPageSize(newSize);
                      setCurrentPage(0);
                      fetchProducts(0, searchQuery, newSize);
                    }}
                    className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
              
              {totalPages > 0 && (
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
                  
                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i).map((page) => {
                      // Show first, last, current, and adjacent pages
                      const showPage = page === 0 || 
                                       page === totalPages - 1 || 
                                       Math.abs(page - currentPage) <= 1;
                      const showEllipsis = page === 1 && currentPage > 2 || 
                                           page === totalPages - 2 && currentPage < totalPages - 3;
                      
                      if (showEllipsis && !showPage) {
                        return <span key={page} className="px-1 text-muted-foreground">...</span>;
                      }
                      
                      if (!showPage) return null;
                      
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => fetchProducts(page, searchQuery)}
                        >
                          {page + 1}
                        </Button>
                      );
                    })}
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
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

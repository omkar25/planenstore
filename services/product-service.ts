/**
 * Product API service
 * Handles all product-related API calls
 */

import { ProductFormValues } from '@/lib/product-schema';
import { fetchApi, fetchFormDataApi } from './api-config';
import { AxiosRequestConfig } from 'axios';

export interface ProductImage {
  id: number;
  url: string;
}

export interface ProductCategory {
  code: string;
  name: string;
}

export interface Product {
  id?: string;
  code: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  listPrice: number;
  brand: string;
  avgRating: number;
  numReviews: number;
  numSales: number;
  countInStock: number;
  description: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  images: ProductImage[];
  ratingDistribution: unknown[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface FacetValue {
  value: string;
  count: number;
}

export interface Facet {
  name: string;
  values: FacetValue[];
}

export interface CategoryProductsResponse {
  products: ProductsResponse;
  facets: Facet[];
}

/**
 * Product service for handling all product-related API calls
 */
export const ProductService = {
  /**
   * Get all products with pagination
   * Uses proxy route for public requests to hide backend URL
   */
  getProducts: async (page = 0, size = 10): Promise<ProductsResponse> => {
    // Use proxy route for client-side requests
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/shop/products?page=${page}&size=${size}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    }
    
    // Server-side: use direct API
    return fetchApi<ProductsResponse>(`/products?page=${page}&size=${size}`);
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (id: string): Promise<Product> => {
    return fetchApi<Product>(`/products/${id}`);
  },

  /**
   * Get a single product by code
   */
  getProductByCode: async (code: string): Promise<Product> => {
    return fetchApi<Product>(`/products/${code}`);
  },

  /**
   * Get a single product by slug
   * Uses proxy route for public requests to hide backend URL
   */
  getProductBySlug: async (slug: string): Promise<Product> => {
    // Use proxy route for client-side requests
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/shop/products/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return res.json();
    }
    
    // Server-side: use direct API
    return fetchApi<Product>(`/products/slug/${slug}`);
  },

  /**
   * Create a new product with images
   * Uses FormData to handle file uploads
   */
  createProductWithImages: async (productData: ProductFormValues, imageFiles: File[]): Promise<Product> => {
    const formData = new FormData();
    
    // Add product data as JSON string
    const productJson = {
      name: productData.name,
      slug: productData.slug,
      brand: productData.brand,
      category: productData.category, // This now contains the category code from dropdown selection
      description: productData.description,
      price: productData.price,
      listPrice: productData.listPrice,
      countInStock: productData.countInStock,
      published: productData.isPublished, // Backend expects 'published', not 'isPublished'
      tags: productData.tags,
      sizes: productData.sizes,
      colors: productData.colors,
    };
    
 
    formData.append('product', JSON.stringify(productJson));
    
    // Add image files
    imageFiles.forEach((file) => {
      
      formData.append('images', file);
    });
    
    
    return fetchFormDataApi<Product>('/products/with-images', formData, {
      method: 'POST',
    });
  },

  /**
   * Update an existing product
   */
  updateProduct: async (id: string, productData: Partial<ProductFormValues>): Promise<Product> => {
    return fetchApi<Product>(`/products/${id}`, {
      method: 'PUT',
      data: productData,
    });
  },

  /**
   * Update a product with images
   * Uses FormData to handle file uploads
   */
  updateProductWithImages: async (code: string, productData: Partial<ProductFormValues>, imageFiles: File[]): Promise<Product> => {
    const formData = new FormData();
    
    // Add product data as JSON string - format for update API
    const productJson = {
      name: productData.name,
      slug: productData.slug,
      brand: productData.brand,
      category: productData.category, // Category code from dropdown selection
      description: productData.description,
      price: productData.price,
      listPrice: productData.listPrice,
      countInStock: productData.countInStock,
      published: productData.isPublished, // Backend expects 'published', not 'isPublished'
      tags: productData.tags,
      sizes: productData.sizes,
      colors: productData.colors,
    };
    
  
    formData.append('product', JSON.stringify(productJson));
    
    // Add image files
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    
    const config: AxiosRequestConfig = {
      method: 'PUT'
    };
    
    return fetchFormDataApi<Product>(`/products/${code}/with-images`, formData, config);
  },

  /**
   * Delete a product
   */
  deleteProduct: async (id: string): Promise<void> => {
    return fetchApi<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Search products using the dedicated search API
   */
  searchProducts: async (
    keyword: string, 
    page = 0, 
    size = 10, 
    sortBy = 'createdAt', 
    sortDir = 'desc'
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
      keyword: keyword,
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
      sortDir: sortDir
    });
    
    
    return fetchApi<ProductsResponse>(`/products/search?${params.toString()}`);
  },

  /**
   * Get products by category code with pagination
   */
  getProductsByCategory: async (
    categoryCode: string,
    page = 0,
    size = 10
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    
    
    // Backend returns nested structure: { products: ProductsResponse, facets: [] }
    const response = await fetchApi<CategoryProductsResponse>(`/products/category/c/${categoryCode}?${params.toString()}`);
    
    
    // Extract the products data from the nested structure
    return response.products;
  },

  /**
   * Get products by category with facets
   */
  getProductsByCategoryWithFacets: async (
    categoryCode: string,
    page = 0,
    size = 10
  ): Promise<CategoryProductsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    
    return fetchApi<CategoryProductsResponse>(`/products/category/c/${categoryCode}?${params.toString()}`);
  },
};

export default ProductService;

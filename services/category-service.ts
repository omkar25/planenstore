import { fetchApi } from './api-config';

export interface SubCategory {
  code: string;
  name: string;
}

export interface Category {
  id?: string;
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  level?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subCategories?: SubCategory[];
  productCount?: number;
}

export interface CategoriesResponse {
  categories: Category[];
  totalCount: number;
  page: number;
  limit: number;
}

// Input type for creating/updating categories
export type CategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>;

// Simple in-memory cache for categories (client-side compatible)
const cache = {
  categories: null as Category[] | null,
  timestamp: 0,
  TTL: 5 * 60 * 1000, // 5 minutes cache TTL
  
  isValid(): boolean {
    return this.categories !== null && (Date.now() - this.timestamp) < this.TTL;
  },
  
  set(data: Category[]): void {
    this.categories = data;
    this.timestamp = Date.now();
  },
  
  get(): Category[] | null {
    return this.isValid() ? this.categories : null;
  },
  
  invalidate(): void {
    this.categories = null;
    this.timestamp = 0;
  }
};

export const CategoryService = {
  /**
   * Get all categories (with in-memory caching)
   * Uses proxy route for public requests to hide backend URL
   */
  getAllCategories: async (forceRefresh = false): Promise<Category[]> => {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh) {
      const cached = cache.get();
      if (cached) {
        return cached;
      }
    }
    
    // Use proxy route for client-side requests
    if (typeof window !== 'undefined') {
      const res = await fetch('/api/shop/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const response = await res.json();
      cache.set(response);
      return response;
    }
    
    // Server-side: use direct API
    const response = await fetchApi<Category[]>('/categories');
    cache.set(response);
    return response;
  },

  /**
   * Get categories with pagination
   */
  getCategories: async (page = 1, limit = 100): Promise<CategoriesResponse> => {
    const response = await fetchApi<CategoriesResponse>(`/categories?page=${page}&limit=${limit}`);
    return response;
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await fetchApi<Category>(`/categories/${id}`);
    return response;
  },

  /**
   * Get category by code
   */
  getCategoryByCode: async (code: string): Promise<Category> => {
    try {
      const response = await fetchApi<Category>(`/categories/code/${code}`);
      return response;
    } catch {
      // Fallback: search in all categories
      const allCategories = await CategoryService.getAllCategories();
      const category = allCategories.find(cat => cat.code === code);
      if (!category) {
        throw new Error(`Category with code ${code} not found`);
      }
      return category;
    }
  },

  /**
   * Create a new category
   */
  createCategory: async (categoryData: CategoryInput): Promise<Category> => {
    const response = await fetchApi<Category>('/categories', {
      method: 'POST',
      data: categoryData,
    });
    cache.invalidate(); // Invalidate cache after mutation
    return response;
  },

  /**
   * Update a category by code
   */
  updateCategory: async (code: string, categoryData: CategoryInput): Promise<Category> => {
    const response = await fetchApi<Category>(`/categories/${code}`, {
      method: 'PUT',
      data: categoryData,
    });
    cache.invalidate(); // Invalidate cache after mutation
    return response;
  },

  /**
   * Delete a category by code
   */
  deleteCategory: async (code: string): Promise<void> => {
    await fetchApi<void>(`/categories/${code}`, {
      method: 'DELETE',
    });
    cache.invalidate(); // Invalidate cache after mutation
  },

  /**
   * Invalidate the categories cache manually
   */
  invalidateCache: (): void => {
    cache.invalidate();
  },
};

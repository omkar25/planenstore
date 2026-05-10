/**
 * Simple Service Registry for Dependency Injection
 * Allows injecting and retrieving services by name
 */

import { CategoryService } from './category-service';
import { ProductService } from './product-service';

// Define service types
export interface ServiceRegistry {
  categoryService: typeof CategoryService;
  productService: typeof ProductService;
}

// Service container
const services: ServiceRegistry = {
  categoryService: CategoryService,
  productService: ProductService,
};

/**
 * Get a service by name
 * @example const categoryService = getService('categoryService');
 */
export function getService<K extends keyof ServiceRegistry>(
  serviceName: K
): ServiceRegistry[K] {
  const service = services[serviceName];
  if (!service) {
    throw new Error(`Service "${serviceName}" not found in registry`);
  }
  return service;
}

/**
 * Register a custom service (useful for testing/mocking)
 */
export function registerService<K extends keyof ServiceRegistry>(
  serviceName: K,
  service: ServiceRegistry[K]
): void {
  services[serviceName] = service;
}

export default services;

import { z } from "zod";

// Helper function to convert string to slug
export const toSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Rating distribution schema
const ratingDistributionSchema = z.array(
  z.object({
    rating: z.number().int().min(1).max(5),
    count: z.number().int().min(0),
  })
);

// Translation keys interface for product validation messages
export interface ProductSchemaTranslations {
  nameMin: string;
  categoryRequired: string;
  imagesMin: string;
  pricePositive: string;
  brandRequired: string;
  countInStockMin: string;
  descriptionMin: string;
}

// Create product schema with localized messages
export const createProductSchema = (t: ProductSchemaTranslations) => z.object({
  name: z.string().min(3, { message: t.nameMin }),
  slug: z.string().optional(),
  category: z.string().min(1, { message: t.categoryRequired }),
  images: z.array(z.string()).min(1, { message: t.imagesMin }),
  imageFiles: z.array(z.instanceof(File)).optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
  price: z.number().positive({ message: t.pricePositive }),
  listPrice: z.number().min(0).default(0),
  brand: z.string().min(1, { message: t.brandRequired }),
  avgRating: z.number().min(0).max(5).default(0),
  numReviews: z.number().int().min(0).default(0),
  ratingDistribution: ratingDistributionSchema.optional(),
  numSales: z.number().int().min(0).default(0),
  countInStock: z.number().int().min(0, { message: t.countInStockMin }),
  description: z.string().min(10, { message: t.descriptionMin }),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
});

// Create form schema with localized messages
export const createProductFormSchema = (t: ProductSchemaTranslations) => 
  createProductSchema(t).omit({
    avgRating: true,
    numReviews: true,
    ratingDistribution: true,
    numSales: true,
  }).extend({
    price: z.number().positive({ message: t.pricePositive }).optional(),
    brand: z.string().optional(),
    countInStock: z.number().int().min(0).optional(),
  });

// Default schema (for type inference)
export const productSchema = createProductSchema({
  nameMin: "Product name must be at least 3 characters",
  categoryRequired: "Category is required",
  imagesMin: "At least one image is required",
  pricePositive: "Price must be positive",
  brandRequired: "Brand is required",
  countInStockMin: "Count in stock must be 0 or greater",
  descriptionMin: "Description must be at least 10 characters",
});

export const productFormSchema = productSchema.omit({
  avgRating: true,
  numReviews: true,
  ratingDistribution: true,
  numSales: true,
}).extend({
  price: z.number().positive().optional(),
  brand: z.string().optional(),
  countInStock: z.number().int().min(0).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

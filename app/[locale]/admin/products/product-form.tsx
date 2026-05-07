"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

import { createProductFormSchema, ProductFormValues, toSlug } from "@/lib/product-schema";
import { CategoryService, Category } from "@/services/category-service";

interface ProductFormProps {
  mode?: 'create' | 'update';
  initialData?: ProductFormValues;
  onSubmit: (values: ProductFormValues, imageFiles: File[]) => Promise<{ success: boolean; message: string }>;
}

export default function ProductForm({ mode = 'create', initialData, onSubmit }: ProductFormProps) {
  const t = useTranslations('admin.products');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(
    initialData?.images || []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Default values for the form
  const defaultValues: ProductFormValues = {
    name: "",
    slug: "",
    category: "",
    images: [],
    imageFiles: [],
    tags: [],
    isPublished: true,
    price: 0,
    listPrice: 0,
    brand: "",
    countInStock: 0,
    description: "",
    sizes: [],
    colors: [],
  };

  // Create localized schema
  const productFormSchema = createProductFormSchema({
    nameMin: t('validation.nameMin'),
    categoryRequired: t('validation.categoryRequired'),
    imagesMin: t('validation.imagesMin'),
    pricePositive: t('validation.pricePositive'),
    brandRequired: t('validation.brandRequired'),
    countInStockMin: t('validation.countInStockMin'),
    descriptionMin: t('validation.descriptionMin'),
  });

  // Initialize form with default values or initialData
  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || defaultValues,
  });

  // Fetch categories on component mount
  const fetchCategories = useCallback(async () => {
    // Skip if categories are already loaded
    if (categories.length > 0) {
      return;
    }

    try {
      setLoadingCategories(true);
      const fetchedCategories = await CategoryService.getAllCategories();
      setCategories(fetchedCategories);
    } catch {
      toast.error(t('loadCategoriesError'));
    } finally {
      setLoadingCategories(false);
    }
  }, [categories.length, t]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...newFiles]);
      
      // Create preview URLs for selected images
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Update form value
      const currentImages = form.getValues().images || [];
      form.setValue('images', [...currentImages, ...newPreviewUrls]);
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    // Remove from preview URLs
    const newPreviewUrls = [...imagePreviewUrls];
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
    
    // Remove from selected files if it's a new image
    if (index >= (initialData?.images?.length || 0)) {
      const newSelectedImages = [...selectedImages];
      newSelectedImages.splice(index - (initialData?.images?.length || 0), 1);
      setSelectedImages(newSelectedImages);
    }
    
    // Update form value
    form.setValue('images', newPreviewUrls);
  };

  // Handle form submission
  const handleSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
      setIsSubmitting(true);
      
      // Pass raw values and image files to the page component
      const result = await onSubmit(values, selectedImages);
      
      if (result.success) {
        form.reset();
        setSelectedImages([]);
        setImagePreviewUrls([]);
        setTags([]);
        setSizes([]);
        setColors([]);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error(t('saveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use state to track tags for rendering
  const [tags, setTags] = React.useState<string[]>(form.getValues().tags || []);
  
  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      
      if (value && !tags.includes(value)) {
        const newTags = [...tags, value];
        setTags(newTags);
        form.setValue('tags', newTags);
        input.value = '';
      }
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag: string) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  // Use state to track sizes for rendering
  const [sizes, setSizes] = React.useState<string[]>(form.getValues().sizes || []);
  
  // Handle size input
  const handleSizeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim().toUpperCase();
      
      if (value && !sizes.includes(value)) {
        const newSizes = [...sizes, value];
        setSizes(newSizes);
        form.setValue('sizes', newSizes);
        input.value = '';
      }
    }
  };

  // Remove a size
  const removeSize = (sizeToRemove: string) => {
    const newSizes = sizes.filter((size: string) => size !== sizeToRemove);
    setSizes(newSizes);
    form.setValue('sizes', newSizes);
  };

  // Use state to track colors for rendering
  const [colors, setColors] = React.useState<string[]>(form.getValues().colors || []);
  
  // Handle color input
  const handleColorInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      
      if (value && !colors.includes(value)) {
        const newColors = [...colors, value];
        setColors(newColors);
        form.setValue('colors', newColors);
        input.value = '';
      }
    }
  };

  // Remove a color
  const removeColor = (colorToRemove: string) => {
    const newColors = colors.filter((color: string) => color !== colorToRemove);
    setColors(newColors);
    form.setValue('colors', newColors);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('form.basicInfo')}</h2>
          
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.name')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('form.namePlaceholder')} 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const slugValue = toSlug(e.target.value);
                      form.setValue('slug', slugValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.slug')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('form.slugPlaceholder')} 
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t('form.slugDescription')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.brand')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('form.brandPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.category')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingCategories}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingCategories ? t('form.loadingCategories') : t('form.selectCategory')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category, index) => (
                      <SelectItem 
                        key={category.code || category.id || `category-${index}`} 
                        value={category.code || category.id || ''}
                      >
                        {category.name || t('form.unnamedCategory')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {loadingCategories ? t('form.loadingCategoriesDesc') : t('form.categoriesAvailable', { count: categories.length })}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.description')}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t('form.descriptionPlaceholder')} 
                    className="min-h-32" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Pricing and Inventory */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('form.pricingInventory')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.price')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? 0 : parseFloat(value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* List Price */}
            <FormField
              control={form.control}
              name="listPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.listPrice')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? 0 : parseFloat(value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('form.listPriceDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Count In Stock */}
            <FormField
              control={form.control}
              name="countInStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.countInStock')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="1"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? 0 : parseInt(value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Published Status */}
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('form.published')}
                    </FormLabel>
                    <FormDescription>
                      {t('form.publishedDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('form.images')}</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Image Upload */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div 
                        key={index} 
                        className="relative w-24 h-24 rounded-md overflow-hidden border"
                      >
                        <Image 
                          src={url} 
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-6 w-6 text-gray-400" />
                        <p className="text-xs text-gray-500 mt-2">{t('form.upload')}</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Variants */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('form.variantsAttributes')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tags */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">{t('form.tags')}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-gray-100 rounded-md px-2 py-1"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Input 
                  placeholder={t('form.tagsPlaceholder')} 
                  onKeyDown={handleTagInput}
                />
              </CardContent>
            </Card>
            
            {/* Sizes */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">{t('form.sizes')}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {sizes.map((size, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-gray-100 rounded-md px-2 py-1"
                    >
                      <span className="text-sm">{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Input 
                  placeholder={t('form.sizesPlaceholder')} 
                  onKeyDown={handleSizeInput}
                />
              </CardContent>
            </Card>
            
            {/* Colors */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">{t('form.colors')}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {colors.map((color, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-gray-100 rounded-md px-2 py-1"
                    >
                      <span className="text-sm">{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Input 
                  placeholder={t('form.colorsPlaceholder')} 
                  onKeyDown={handleColorInput}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? (mode === 'update' ? t('form.updating') : t('form.creating')) 
            : (mode === 'update' ? t('form.updateProduct') : t('form.createProduct'))
          }
        </Button>
      </form>
    </Form>
  );
}
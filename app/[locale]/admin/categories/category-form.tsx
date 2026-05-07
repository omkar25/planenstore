'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { CategoryService, Category } from '@/services/category-service';

// Create schema with translations
const createCategoryFormSchema = (t: (key: string) => string) => z.object({
  code: z.string().min(1, t('admin.categories.codeRequired')).max(50, t('admin.categories.codeMaxLength')),
  name: z.string().min(1, t('admin.categories.nameRequired')).max(100, t('admin.categories.nameMaxLength')),
  description: z.string().optional(),
  subCategories: z.array(z.object({
    code: z.string().min(1, t('admin.categories.subcategoryCodeRequired')),
    name: z.string().min(1, t('admin.categories.subcategoryNameRequired')),
  })).optional(),
});

type CategoryFormValues = z.infer<ReturnType<typeof createCategoryFormSchema>>;

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (category: Category) => void;
  mode?: 'create' | 'edit';
  initialData?: Partial<Category>;
}

export default function CategoryForm({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  initialData,
}: CategoryFormProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create schema with translations
  const categoryFormSchema = createCategoryFormSchema(t);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      subCategories: initialData?.subCategories || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subCategories',
  });

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && mode === 'edit') {
      console.log('🔄 Resetting form with initial data:', initialData);
      form.reset({
        code: initialData.code || '',
        name: initialData.name || '',
        description: initialData.description || '',
        subCategories: initialData.subCategories || [],
      });
    } else if (mode === 'create') {
      // Reset to empty form for create mode
      form.reset({
        code: '',
        name: '',
        description: '',
        subCategories: [],
      });
    }
  }, [initialData, mode, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsSubmitting(true);

      // Prepare the category data for the API
      const categoryData = {
        code: data.code,
        name: data.name,
        description: data.description,
        superCategoryCode: null, // Always null for top-level categories
        subCategories: data.subCategories?.map(sub => ({
          code: sub.code,
          name: sub.name,
          superCategoryCode: data.code, // Set the parent category code
        })) || [],
      };


      let result: Category;
      if (mode === 'create') {
        result = await CategoryService.createCategory(categoryData);
        toast.success(t('admin.categories.createSuccess'));
      } else {
        // Edit mode - update existing category
        if (!initialData?.code) {
          throw new Error(t('admin.categories.codeRequiredForUpdate'));
        }
        result = await CategoryService.updateCategory(initialData.code, categoryData);
        toast.success(t('admin.categories.updateSuccess'));
      }

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }

    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('admin.categories.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSubCategory = () => {
    append({ code: '', name: '' });
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('admin.categories.createTitle') : t('admin.categories.editTitle')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? t('admin.categories.createDescription')
              : t('admin.categories.editDescription')
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Category Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.categories.code')} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('admin.categories.codePlaceholder')}
                        {...field}
                        disabled={mode === 'edit'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.categories.name')} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('admin.categories.namePlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.categories.descriptionOptional')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('admin.categories.descriptionPlaceholder')}
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subcategories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">{t('admin.categories.subcategories')}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubCategory}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t('admin.categories.addSubcategory')}
                </Button>
              </div>

              {fields.length > 0 && (
                <div className="space-y-3 border rounded-lg p-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-3">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`subCategories.${index}.code`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.categories.subcategoryCode')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('admin.categories.subcategoryCodePlaceholder')}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`subCategories.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.categories.subcategoryName')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('admin.categories.subcategoryNamePlaceholder')}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t('admin.categories.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (mode === 'create' ? t('admin.categories.creating') : t('admin.categories.updating'))
                  : (mode === 'create' ? t('admin.categories.create') : t('admin.categories.update'))
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

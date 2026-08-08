'use client';

import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  CakeIcon,
  CurrencyDollarIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  Square2StackIcon,
  ExclamationCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import FormInput from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { AddProductSchema, type AddProductData } from '@/types/merchant-products';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct } from '@/actions/actions';
import { createClient } from '@/utils/supabase/client';

interface Category {
  id: string;
  name: string;
}

export default function AddProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddProductData>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      is_active: true,
      category_id: "",
    },
  });

  const onSubmit = async (data: AddProductData) => {
    setIsUploading(true);
    let finalImageUrl = data.image_url || null;

    try {
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();

        const sanitizedName = data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        const timestamp = new Date().getTime();

        const fileName = `${sanitizedName}-${timestamp}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw new Error("Failed to upload image.");

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const finalProductData = {
        ...data,
        image_url: finalImageUrl || "",
      };

      const response = await addProduct(finalProductData);

      if (response?.error) {
        setError('root', { message: response.error });
        return;
      }

      router.push('/merchant/product-catalog');
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred while saving.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='space-y-3 rounded-2xl h-full'>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:p-6">
        <div className='flex-1 max-w-3xl mx-auto w-full'>
          {errors.root && (
            <div className='mb-6 rounded-md bg-red-50 p-4 border border-red-200'>
              <p className='text-sm font-medium text-red-800'>
                {errors.root.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-2'>
            <FormInput
              label='Product Name'
              name='name'
              register={register}
              error={errors.name}
              placeholder='e.g., Tomato Sauce'
              icon={Square2StackIcon}
            />

            <div>
              <label
                className='mb-3 mt-5 block text-txt-primary text-sm font-semibold uppercase tracking-wider'
                htmlFor='category_id'
              >
                Category
              </label>
              <div className='relative'>
                <select
                  id='category_id'
                  {...register("category_id")}
                  aria-invalid={!!errors.category_id}
                  className='peer block w-full rounded-md border border-brand-primary py-[9px] pl-10 pr-10 text-sm focus:outline-brand-primary bg-surface-bg focus:text-txt-primary appearance-none cursor-pointer' 
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <CakeIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-green-800 peer-focus:text-green-400' />
              </div>
              {errors.category_id && <p className="mt-1 text-sm text-red-700 font-semibold">{errors.category_id.message}</p>}
            </div>

            <div>
              <label 
                className='mb-3 mt-5 block text-txt-primary text-sm font-semibold uppercase tracking-wider' 
                htmlFor='description'
              >
                Description
              </label>
              <div className='relative'>
                <textarea
                  id='description'
                  rows={4}
                  placeholder='Enter a short description'
                  {...register("description")}
                  aria-invalid={!!errors.description}
                  className='peer block w-full rounded-md border border-brand-primary py-[9px] pl-10 pr-4 text-sm placeholder:text-green-700 focus:outline-brand-primary bg-surface-bg focus:text-txt-primary resize-y'
                />
                <PencilSquareIcon className='pointer-events-none absolute left-3 top-[11px] h-[18px] text-green-800 peer-focus:text-green-400' />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-700 font-semibold">{errors.description.message}</p>
              )}
            </div>

            <FormInput
              label='Unit (e.g., 1 loaf, 16 oz)'
              name='unit'
              register={register}
              error={errors.unit}
              placeholder='e.g., 15 oz'
              icon={Square2StackIcon}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="mb-3 mt-5 block text-txt-primary text-sm font-semibold uppercase tracking-wider">
                  Price
                </label>
                <div className="relative">
                  <input 
                  id='price'
                  type="number" 
                  step='0.01'
                  placeholder='0.00'
                  {...register("price", { valueAsNumber: true })}
                  className='peer block w-full rounded-md border border-brand-primary py-[9px] pl-10 pr-4 text-sm placeholder:text-green-700 focus:outline-brand-primary bg-surface-bg focus:text-txt-primary'
                  />
                  <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-green-800 peer-focus:text-green-400' />
                </div>
                {errors.price && 
                  <div className="mt-1 flex items-center gap-1">
                    <ExclamationCircleIcon className='pointer-events-none h-[18px] text-red-700' />
                    <p className="text-sm text-red-700 font-semibold">
                      {errors.price.message}
                    </p>
                  </div>
                }
              </div>

              <div>
                <label className='mb-3 mt-5 block text-txt-primary text-sm font-semibold uppercase tracking-wider' htmlFor='stock_quantity'>
                  Stock Quantity
                </label>
                <div className='relative'>
                  <input
                    id='stock_quantity'
                    type='number'
                    placeholder='0'
                    {...register("stock_quantity", { valueAsNumber: true })}
                    className='peer block w-full rounded-md border border-brand-primary py-[9px] pl-10 pr-4 text-sm placeholder:text-green-700 focus:outline-brand-primary bg-surface-bg focus:text-txt-primary'
                  />
                  <PlusCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-green-800 peer-focus:text-green-400' />
                </div>
                {errors.stock_quantity && 
                  <div className="mt-1 flex items-center gap-1">
                    <ExclamationCircleIcon className='pointer-events-none h-[18px] text-red-700' />
                    <p className="text-sm text-red-700 font-semibold">
                      {errors.stock_quantity.message}
                    </p>
                  </div>
                }
              </div>
            </div>
            
            <div>
              <label className='mb-3 mt-5 block text-txt-primary text-sm font-semibold uppercase tracking-wider' htmlFor='image_upload'>
                Product Image
              </label>
              <div className='relative flex items-center w-full rounded-md border border-brand-primary py-[9px] pl-10 pr-4 text-sm bg-surface-bg focus-within:outline-brand-primary'>
                <PhotoIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-green-800' />
                <input
                  id='image_upload'
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-slate-700 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-light file:text-brand-dark hover:file:bg-brand-primary hover:file:text-white transition-colors cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-6 pb-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" {...register('is_active')} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                <span className="ml-3 text-sm font-bold text-slate-700 uppercase tracking-wider">Product is Active</span>
              </label>
            </div>

            <button
              type='submit'
              disabled={isSubmitting || isUploading}
              className='rounded-md border border-brand-primary py-[9px] text-brand-primary hover:bg-brand-primary bg-surface-bg hover:text-surface-bg font-bold mt-8 w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting || isUploading ? (
                <>
                  {isUploading ? 'Uploading Image...' : 'Saving Product...'}
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                <>
                  Add Product
                  <ArrowRightIcon className='h-5 w-5' />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

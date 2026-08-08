'use client';

import { BuildingOffice2Icon, HashtagIcon, HomeIcon, MapPinIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import FormInput from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { AddressSchema, US_STATES, type AddressData } from '@/types/address';
import type { Address } from '@/types/address';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createAddress, updateAddress } from '@/actions/addresses';
import AccountCard from '@/app/ui/account/account-card';
import PageTitle from '@/app/ui/account/page-title';

export default function AddressForm({ address }: { address?: Address }) {
  const router = useRouter();
  const isEditing = !!address;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddressData>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      full_name: address?.full_name ?? '',
      address_1: address?.address_1 ?? '',
      address_2: address?.address_2 ?? '',
      city: address?.city ?? '',
      state: address?.state,
      zip_code: address?.zip_code ?? '',
      is_default: address?.is_default ?? false,
    },
  });

  const onSubmit = async (data: AddressData) => {
    const response = isEditing
      ? await updateAddress(address.id, data)
      : await createAddress(data);

    if (response?.error) {
      setError('root', {
        message: response.error,
      });
      return;
    }

    router.push('/account/address');
  };

  return (
    <>
      <PageTitle>{isEditing ? 'Edit Address' : 'Add Address'}</PageTitle>

      <AccountCard className='p-4 md:p-6'>
        {errors.root && (
          <div className='mb-6 rounded-md border border-red-200 bg-red-50 p-4'>
            <p className='text-sm font-medium text-red-800'>{errors.root.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          <FormInput
            label='Full Name'
            name='full_name'
            register={register}
            error={errors.full_name}
            placeholder='Enter the recipient name'
            autoComplete='name'
            icon={UserCircleIcon}
            uppercase={false}
          />
          <FormInput
            label='Address Line 1'
            name='address_1'
            register={register}
            error={errors.address_1}
            placeholder='Street address'
            autoComplete='address-line1'
            icon={HomeIcon}
            uppercase={false}
          />
          <FormInput
            label='Address Line 2'
            name='address_2'
            register={register}
            error={errors.address_2}
            placeholder='Apartment, suite, etc. (optional)'
            autoComplete='address-line2'
            icon={MapPinIcon}
            uppercase={false}
          />
          <FormInput
            label='City'
            name='city'
            register={register}
            error={errors.city}
            placeholder='Enter your city'
            autoComplete='address-level2'
            icon={BuildingOffice2Icon}
            uppercase={false}
          />

          <div>
            <label
              className='mb-3 mt-5 block font-bold text-txt-primary'
              htmlFor='state'
            >
              State
            </label>
            <select
              id='state'
              defaultValue=''
              {...register('state')}
              aria-invalid={!!errors.state}
              className='block w-full rounded-md border border-brand-primary py-[9px] px-3 text-sm bg-surface-bg text-txt-primary focus:outline-brand-primary'
            >
              <option value='' disabled>Select a state</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>{state.name}</option>
              ))}
            </select>
            {errors.state && (
              <p className='mt-1 text-sm font-semibold text-red-700'>
                {errors.state.message}
              </p>
            )}
          </div>

          <FormInput
            label='ZIP Code'
            name='zip_code'
            register={register}
            error={errors.zip_code}
            placeholder='Enter your ZIP code'
            autoComplete='postal-code'
            icon={HashtagIcon}
            uppercase={false}
          />

          <label className='mt-5 flex items-center gap-2 text-sm font-semibold text-txt-primary'>
            <input
              type='checkbox'
              {...register('is_default')}
              className='h-4 w-4 rounded border-brand-primary text-brand-primary focus:outline-brand-primary'
            />
            Set as default address
          </label>

          <div className='mt-6 flex gap-3'>
            <button
              type='button'
              onClick={() => router.push('/account/address')}
              className='w-full rounded-md border border-slate-300 py-[9px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='rounded-md border border-brand-primary py-[9px] text-brand-primary hover:bg-brand-primary bg-surface-bg hover:text-surface-bg font-bold w-full flex items-center justify-center gap-2 cursor-pointer'
            >
              {isSubmitting ? (
                <>
                  Saving...
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </AccountCard>
    </>
  );
}

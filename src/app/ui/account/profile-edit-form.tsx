'use client';

import { PhoneIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import FormInput from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { ProfileUpdateSchema, type ProfileUpdateData, type Profile } from '@/types/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/actions/actions';
import AccountCard from '@/app/ui/account/account-card';
import PageTitle from '@/app/ui/account/page-title';

/**
 * Defines the props for the ProfileEditForm component.
 */
interface ProfileEditFormProps {
  // The user's current profile data to pre-fill the form.
  profile: Profile;
}

/**
 * A client component that renders a form for editing user profile information.
 * @param {ProfileEditFormProps} props - The component props.
 */
export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateData>({
    // Use Zod for schema-based validation.
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone_number: profile.phone_number ?? '',
      preferred_contact_method: profile.preferred_contact_method,
    },
  });

  /**
   * Handles the form submission by calling the `updateProfile` server action.
   * @param {ProfileUpdateData} data - The validated form data.
   */
  const onSubmit = async (data: ProfileUpdateData) => {
    const response = await updateProfile(data);

    // If the server action returns an error, display it at the top of the form.
    if (response?.error) {
      setError('root', {
        message: response.error,
      });
      return;
    }

    // On success, redirect the user back to their profile view.
    router.push('/account/profile');
  };

  return (
    <>
      <PageTitle>Edit Account Details</PageTitle>

      <AccountCard className='p-4 md:p-6'>
        {/* Display a global error message if the server action fails. */}
        {errors.root && (
          <div className='mb-6 rounded-md border border-red-200 bg-red-50 p-4'>
            <p className='text-sm font-medium text-red-800'>{errors.root.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          {/* Reusable input components for each form field. */}
          <FormInput
            label='First Name'
            name='first_name'
            register={register}
            error={errors.first_name}
            placeholder='Enter your first name'
            autoComplete='given-name'
            icon={UserCircleIcon}
            uppercase={false}
          />
          <FormInput
            label='Last Name'
            name='last_name'
            register={register}
            error={errors.last_name}
            placeholder='Enter your last name'
            autoComplete='family-name'
            icon={UserCircleIcon}
            uppercase={false}
          />
          <FormInput
            label='Phone Number'
            name='phone_number'
            type='tel'
            register={register}
            error={errors.phone_number}
            placeholder='Enter your phone number'
            autoComplete='tel'
            icon={PhoneIcon}
            uppercase={false}
          />

          {/* A standard select input for the preferred contact method. */}
          <div>
            <label
              className='mb-3 mt-5 block font-bold text-txt-primary'
              htmlFor='preferred_contact_method'
            >
              Preferred Contact Method
            </label>
            <select
              id='preferred_contact_method'
              {...register('preferred_contact_method')}
              aria-invalid={!!errors.preferred_contact_method}
              className='block w-full rounded-md border border-brand-primary py-[9px] px-3 text-sm bg-surface-bg text-txt-primary focus:outline-brand-primary'
            >
              <option value='email'>Email</option>
              <option value='phoneNumber'>Phone</option>
            </select>
            {errors.preferred_contact_method && (
              <p className='mt-1 text-sm font-semibold text-red-700'>
                {errors.preferred_contact_method.message}
              </p>
            )}
          </div>

          {/* Form action buttons. */}
          <div className='mt-6 flex gap-3'>
            <button
              type='button'
              onClick={() => router.push('/account/profile')}
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

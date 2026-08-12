'use client';

import { EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import FormInput from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { ChangePasswordSchema, type ChangePasswordData } from '@/types/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/actions/actions';
import AccountCard from '@/app/ui/account/account-card';
import PageTitle from '@/app/ui/account/page-title';

/**
 * A client component that renders a form for users to change their password.
 * It validates input and calls a server action to perform the update.
 */
export default function ChangePasswordForm() {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  // State to manage visibility for the new and confirm password fields.
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ChangePasswordData>({
    // Use Zod for schema-based validation, including password confirmation.
    resolver: zodResolver(ChangePasswordSchema),
  });

  /**
   * Handles the form submission by calling the `changePassword` server action.
   * @param {ChangePasswordData} data - The validated form data.
   */
  const onSubmit = async (data: ChangePasswordData) => {
    const response = await changePassword(data);

    // If the server action returns an error, display it.
    if (response?.error) {
      if (response.field === 'current_password') {
        setError('current_password', { message: response.error });
      } else {
        setError('root', { message: response.error });
      }
      return;
    }

    // On success, reset the form fields.
    reset();
  };

  return (
    <>
      <PageTitle>Change Password</PageTitle>

      <AccountCard className='p-4 md:p-6'>
        <p className='mb-6 text-sm text-slate-600'>
          Enter your current password and choose a new one.
        </p>

        {/* Display a global error message if the server action fails. */}
        {errors.root && (
          <div className='mb-6 rounded-md border border-red-200 bg-red-50 p-4'>
            <p className='text-sm font-medium text-red-800'>{errors.root.message}</p>
          </div>
        )}

        {/* Display a success message when the password is changed. */}
        {isSubmitSuccessful && !errors.root && (
          <div className='mb-6 rounded-md border border-green-200 bg-green-50 p-4'>
            <p className='text-sm font-medium text-green-800'>Password updated successfully.</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          {/* Input for the user's current password with a show/hide toggle. */}
          <FormInput
            label='Current Password'
            name='current_password'
            type={showCurrent ? 'text' : 'password'}
            register={register}
            error={errors.current_password}
            placeholder='Enter your current password'
            autoComplete='current-password'
            icon={KeyIcon}
            icon2={showCurrent ? EyeSlashIcon : EyeIcon}
            onIcon2Click={() => setShowCurrent(!showCurrent)}
            uppercase={false}
          />
          {/* Input for the new password. */}
          <FormInput
            label='New Password'
            name='new_password'
            type={showNew ? 'text' : 'password'}
            register={register}
            error={errors.new_password}
            placeholder='Enter a new password'
            autoComplete='new-password'
            icon={KeyIcon}
            icon2={showNew ? EyeSlashIcon : EyeIcon}
            onIcon2Click={() => setShowNew(!showNew)}
            uppercase={false}
          />
          {/* Input to confirm the new password. */}
          <FormInput
            label='Confirm New Password'
            name='confirm_new_password'
            type={showConfirm ? 'text' : 'password'}
            register={register}
            error={errors.confirm_new_password}
            placeholder='Confirm your new password'
            autoComplete='new-password'
            icon={KeyIcon}
            icon2={showConfirm ? EyeSlashIcon : EyeIcon}
            onIcon2Click={() => setShowConfirm(!showConfirm)}
            uppercase={false}
          />

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
                  Updating...
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                'Update password'
              )}
            </button>
          </div>
        </form>
      </AccountCard>
    </>
  );
}

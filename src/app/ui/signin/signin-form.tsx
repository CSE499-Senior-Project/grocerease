'use client';

import {
  ArrowRightIcon,
  AtSymbolIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import SignInButton from '@/components/SignInButton';
import FormInput from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { SignInSchema, type SignInData } from '@/types/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signinUser } from '@/actions/actions';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const isSignedUp = searchParams.get('signup') === 'true';
  const pageMessage = searchParams.get('message') === 'false';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInData) => {
    const response = await signinUser(data);

    if (response?.error) {
      setError('root', {
        message: response.error,
      });
    }
  };

  return (
    <div className='space-y-3 rounded-2xl h-full'>
      <div className='glass-card p-4 md:p-4 h-full flex flex-col md:rounded-l-none md:rounded-r-2xl justify-center'>
        <h1 className='text-5xl font-bold tracking-tight text-slate-900 mb-6'>
          Welcome to <span className='text-brand-primary'>GrocerEase</span>
        </h1>

        {/* Conditionally render the success banner when the user just registered! */}
        {isSignedUp && (
          <div className='mb-6 rounded-md bg-green-50 p-4 border border-green-200'>
            <p className='text-sm font-medium text-green-800'>
              Account successfully created! Please sign in below.
            </p>
          </div>
        )}

        {pageMessage && (
          <div className='mb-6 rounded-md bg-yellow-50 p-4 border border-yellow-200'>
            <p className='text-sm font-medium text-yellow-800'>
              Please sign in to continue to checkout.
            </p>
          </div>
        )}

        <div className='flex-1'>
          <h1 className='mb-6 text-2xl font-bold'>Please sign in to continue</h1>

          {errors.root && (
            <div className='mb-6 rounded-md border border-red-200 bg-red-50 p-4'>
              <p className='text-sm font-medium text-red-800'>
                {errors.root.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
            <FormInput
              label='Email'
              name='email'
              type='email'
              register={register}
              error={errors.email}
              placeholder='Enter your email address'
              autoComplete='email'
              icon={AtSymbolIcon}
            />
            <FormInput
              label='Password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              register={register}
              error={errors.password}
              placeholder='Enter your password'
              autoComplete='current-password'
              icon={KeyIcon}
              icon2={showPassword ? EyeSlashIcon : EyeIcon}
              onIcon2Click={() => setShowPassword(!showPassword)}
            />
            <input type='hidden' name='redirectTo' />
            <button
              type='submit'
              disabled={isSubmitting}
              className='rounded-md border border-brand-primary py-[9px] text-brand-primary hover:bg-brand-primary bg-surface-bg hover:text-surface-bg font-bold mt-8 w-full flex items-center justify-center gap-2 cursor-pointer'
            >
              
              {isSubmitting ? (
                <>
                  Signing in...
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRightIcon className='h-5 w-5' />
                </>
              )}
            </button>
          </form>

          <div className='flex items-center my-6'>
            <div className='flex-grow border-t border-brand-primary'></div>
            <span className='px-3 text-sm font-bold'>Or</span>
            <div className='flex-grow border-t border-brand-primary'></div>
          </div>

          <form>
            <SignInButton />
          </form>

          <p className='mt-6 text-center text-sm font-semibold'>
            {"Don't have an account? "}
            <Link
              href='/signup'
              className='font-bold text-brand-primary hover:underline'
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

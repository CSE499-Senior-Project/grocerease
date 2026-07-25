'use client';

import { ArrowRightIcon, AtSymbolIcon, KeyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import LoginButton from '@/components/LoginButton';
import FormInput from '@/components/FormInput';
import { useForm } from "react-hook-form";
import { RegistrationSchema, type RegistrationData } from '@/types/profile';
import { zodResolver } from "@hookform/resolvers/zod"
// import { useActionState, useState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/app/lib/actions';
// import { useSearchParams } from 'next/navigation';

export default function RegisterForm() {
  // const onSubmit = async (data) => {
  //   await login()
  // }
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors},
  } = useForm<RegistrationData>({
    resolver: zodResolver(RegistrationSchema),
  });

  const onSubmit = async (data: RegistrationData) => {
    const response = await registerUser(data);

    if (response?.error) {
      setError("root", {
        message: response.error
      });
    }
  };

  return (
    <div className='space-y-3 rounded-2xl h-full'>
      <div className='glass-card p-4 md:p-4 h-full flex flex-col md:rounded-l-none md:rounded-r-2xl justify-center'>
        {/* h1 will be removed once nav-bar is in place */}
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">
          Welcome to <span className="text-brand-primary">GrocerEase</span>
        </h1>
        <div className='flex-1'>
          <h1 className='mb-6 text-2xl font-bold'>
            Please create an account to continue
          </h1>

          {/* Conditionally render the Server Error banner */}
          {errors.root && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm font-medium text-red-800">
                {errors.root.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
            
            <FormInput
              label="First Name"
              name="first_name"
              register={register}
              error={errors.first_name}
              placeholder='Enter your first name'
              autoComplete='given-name'
              icon={UserCircleIcon}
            />

            <FormInput
              label="Last Name"
              name="last_name"
              register={register}
              error={errors.last_name}
              placeholder='Enter your last name'
              autoComplete='family-name'
              icon={UserCircleIcon}
            />
            
            <FormInput
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder='Enter your email address'
              autoComplete='email'
              icon={AtSymbolIcon}
            />
            
            <FormInput
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              placeholder='Enter a password'
              autoComplete='current-password'
              icon={KeyIcon}
            />
            
            <FormInput
              label="Confirm Password"
              name="confirm_password"
              type="password"
              register={register}
              error={errors.confirm_password}
              placeholder='Confirm your password'
              autoComplete='current-password'
              icon={KeyIcon}
            />
            
            <input type="hidden" name='redirectTo' /> {/*value={} /> */}
            <button type='submit' className='rounded-md border border-brand-primary py-[9px] text-brand-primary hover:bg-brand-primary bg-surface-bg hover:text-surface-bg font-bold mt-8 w-full flex items-center justify-center gap-2 cursor-pointer'> {/*aria-disabled disabled>*/}
              Create your account <ArrowRightIcon className='h-5 w-5' />
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-brand-primary"></div>
            <span className="px-3 text-sm font-bold">Or</span>
            <div className="flex-grow border-t border-brand-primary"></div>
          </div>

          <form>
            <LoginButton />
          </form>

          <p className="mt-6 text-center text-sm font-semibold">
            {"Already have an account? "}
            <Link href="/login" className="font-bold text-brand-primary hover:underline">
              Log in!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
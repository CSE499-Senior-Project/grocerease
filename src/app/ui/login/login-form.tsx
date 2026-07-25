'use client';

import { ArrowRightIcon, AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import LoginButton from '@/components/LoginButton';
import FormInput from '@/components/FormInput';
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginData } from '@/types/profile';
import { zodResolver } from "@hookform/resolvers/zod"
// import { useActionState, useState } from 'react';
import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const {
      register,
      handleSubmit,
      formState: { errors},
    } = useForm<LoginData>({
      resolver: zodResolver(LoginSchema),
    });
  
    const onSubmit = handleSubmit((data) => console.log(data))

  return (
    <div className='space-y-3 rounded-2xl h-full'>
      <div className='glass-card p-4 md:p-4 h-full flex flex-col md:rounded-l-none md:rounded-r-2xl justify-center'>
        {/* h1 will be removed once nav-bar is in place */}
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">
          Welcome to <span className="text-brand-primary">GrocerEase</span>
        </h1>
        <div className='flex-1'>
          <h1 className='mb-6 text-2xl font-bold'>
            Please log in to continue
          </h1>

          <form onSubmit={onSubmit} className='w-full'>
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
              placeholder='Enter your password'
              autoComplete='current-password'
              icon={KeyIcon}
            />

            <input type="hidden" name='redirectTo' /> {/*value={} /> */}
            <button type='submit' className='rounded-md border border-brand-primary py-[9px] text-brand-primary hover:bg-brand-primary bg-surface-bg hover:text-surface-bg font-bold mt-8 w-full flex items-center justify-center gap-2 cursor-pointer'> {/*aria-disabled disabled>*/}
              Log in <ArrowRightIcon className='h-5 w-5' />
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
            {"Don't have an account? "}
            <Link href="/register" className="font-bold text-brand-primary hover:underline">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
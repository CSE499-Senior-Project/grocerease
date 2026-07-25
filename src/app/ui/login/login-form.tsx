'use client';

import { ArrowRightIcon, AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import LoginButton from '@/components/LoginButton';
import FormInput from '@/components/FormInput';
// import { useActionState, useState } from 'react';
import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
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

          <form action="" className='w-full'>
            <div>
              <label className='mb-3 mt-5 block text-s font-semibold uppercase tracking-wider text-txt-primary' htmlFor="email">
                Email
              </label>
              <div className='relative'>
                <input className='peer block w-full rounded-md border border-brand-primary py-[9px] pl-10 pr-10 text-sm placeholder:text-green-700 focus:outline-brand-primary bg-surface-bg focus:text-txt-primary' type="email" name="email" id="email" placeholder='Enter your email address' autoComplete='email' required />
                <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-green-800 peer-focus:text-green-400' />
              </div>
            </div>
            <div>
              <label className='mb-3 mt-5 block text-s font-semibold uppercase tracking-wider' htmlFor="password">
                Password
              </label>
              <div className='relative'>
                <input className='peer block w-full rounded-md border border-brand-primary py-[9px] pl-10 pr-10 text-sm placeholder:text-green-700 focus:outline-brand-primary bg-surface-bg focus:text-txt-primary' type="password" name='password' id='password' placeholder='Enter your password' autoComplete='current-password' required minLength={6} />
                <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-green-800 peer-focus:text-green-400' />
              </div>
            </div>
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
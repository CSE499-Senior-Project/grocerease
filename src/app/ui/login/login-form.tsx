'use client';

import { ArrowRightIcon, AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import LoginButton from '@/components/LoginButton';
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

          <form action="">
            <LoginButton />
            {/* <button type='submit' className='w-full flex items-center justify-center gap-3 bg-surface-bg border border-brand-primary rounded-md p-3 text-brand-primary hover:bg-green-50 transition-colors font-medium shadow-sm cursor-pointer'>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
              Sign in with Google
            </button> */}
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
'use client';

import { AtSymbolIcon } from '@heroicons/react/24/outline';
import { useActionState, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  return (
    <div className='space-y-3'>
      <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">
        Welcome to <span className="text-brand-primary">GrocerEase</span>
      </h1>
      <div className='flex-1 p-8'>
        <h1>
          Please log in to continue.
        </h1>

        <form action="" className='w-full'>
          <div>
            <label className='mb-3 mt-5 block text-xs font-semibold uppercase tracking-wider' htmlFor="email">
              Email
            </label>
            <div className='relative'>
              <input type="email" name="email" id="email" placeholder='Enter your email address' required />
              <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2' />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
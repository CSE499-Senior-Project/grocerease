'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArchiveBoxIcon,
  ArrowRightStartOnRectangleIcon,
  IdentificationIcon,
  KeyIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/SignOutButton';

const navItems = [
  { href: '/merchant/orders', label: 'Orders Queue', icon: ArchiveBoxIcon },
  { href: '/merchant/profile', label: 'Account Details', icon: IdentificationIcon }, // change to something
  { href: '/merchant/password', label: 'Password', icon: KeyIcon }, // change to something
  { href: '/merchant/address', label: 'Store Address', icon: MapPinIcon },
];

export default function MerchantSidebar({
  firstName,
  memberSince,
}: {
  firstName: string;
  memberSince: string;
}) {
  const pathname = usePathname();

  return (
    <aside className='w-full shrink-0 p-4 md:w-64'>
      <div className='mb-4'>
        <p className='text-lg font-bold text-slate-900'>Hello, {firstName}!</p>
        <span className='mt-2 inline-block rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white'>
          Account since {memberSince}
        </span>
      </div>

      <nav className='space-y-1 border-t border-slate-200 pt-4'>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-md border-l-4 px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-brand-primary bg-brand-light text-brand-primary'
                  : 'border-transparent text-slate-700 hover:bg-brand-light hover:text-brand-primary'
              }`}
            >
              <Icon className='h-5 w-5' />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className='mt-4 border-t border-slate-200 pt-4'>
        <SignOutButton icon={ArrowRightStartOnRectangleIcon} />
      </div>
    </aside>
  );
}

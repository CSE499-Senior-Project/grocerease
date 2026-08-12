'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArchiveBoxIcon,
  ArrowRightStartOnRectangleIcon,
  IdentificationIcon,
  KeyIcon,
  MapPinIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import SignOutButton from '@/components/SignOutButton';

const navItems = [
  { href: '/account/orders', label: 'Orders & Purchases', icon: ArchiveBoxIcon },
  { href: '/account/profile', label: 'Account Details', icon: IdentificationIcon },
  { href: '/account/password', label: 'Password', icon: KeyIcon },
  { href: '/account/address', label: 'Address Book', icon: MapPinIcon },
  { href: '/account/wallet', label: 'Wallet', icon: WalletIcon },
];

/**
 * The sidebar navigation component for the user's account section.
 * It displays user information, navigation links, and a sign-out button.
 * @param {object} props - The component props.
 * @param {string} props.firstName - The user's first name.
 * @param {string} props.memberSince - The formatted date when the user created their account.
 */
export default function AccountSidebar({
  firstName,
  memberSince,
}: {
  firstName: string;
  memberSince: string;
}) {
  // Get the current URL path to determine the active navigation item.
  const pathname = usePathname();

  return (
    // The main container for the sidebar.
    <aside className='w-full shrink-0 p-4 md:w-64'>
      {/* Header section with a welcome message and member since date. */}
      <div className='mb-4'>
        <p className='text-lg font-bold text-slate-900'>Hello, {firstName}!</p>
        <span className='mt-2 inline-block rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white'>
          Account since {memberSince}
        </span>
      </div>

      {/* Main navigation section. */}
      <nav className='space-y-1 border-t border-slate-200 pt-4'>
        {navItems.map(({ href, label, icon: Icon }) => {
          // Determine if the current link is active by checking if the URL starts with its href.
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              // Dynamically apply classes for active and inactive states.
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

      {/* Footer section with the sign-out button. */}
      <div className='mt-4 border-t border-slate-200 pt-4'>
        <SignOutButton icon={ArrowRightStartOnRectangleIcon} />
      </div>
    </aside>
  );
}

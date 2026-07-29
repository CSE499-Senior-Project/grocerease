'use client'

import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/auth/signout', {
      method: 'POST',
    });

    router.refresh();
    router.push('/');
  }

  return (
    <button
      onClick={handleSignOut}
      className="block w-full px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-brand-light hover:text-brand-primary"
    >
      Sign Out
    </button>
  )
}
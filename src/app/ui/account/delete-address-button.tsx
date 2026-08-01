'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAddress } from '@/actions/addresses';

export default function DeleteAddressButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this address? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const response = await deleteAddress(id);

    if (response?.error) {
      window.alert(response.error);
      setIsDeleting(false);
      return;
    }

    if (response?.warning) {
      window.alert(response.warning);
    }

    router.refresh();
  };

  return (
    <button
      type='button'
      onClick={handleDelete}
      disabled={isDeleting}
      className='shrink-0 rounded-full border border-red-300 px-4 py-1 text-sm font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50 cursor-pointer'
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}

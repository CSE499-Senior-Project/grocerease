'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAddress } from '@/actions/addresses';

/**
 * A client component that renders a button to delete a user's address.
 * It handles user confirmation, loading states, and server action calls.
 * @param {object} props - The component props.
 * @param {string} props.id - The ID of the address to be deleted.
 */
export default function DeleteAddressButton({ id }: { id: string }) {
  const router = useRouter();
  // State to track whether the delete operation is in progress.
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handles the click event for the delete button.
   */
  const handleDelete = async () => {
    if (!window.confirm('Delete this address? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const response = await deleteAddress(id);

    // If the server action returns an error, show it in an alert.
    if (response?.error) {
      window.alert(response.error);
      setIsDeleting(false);
      return;
    }

    // If the server action returns a non-critical warning, show it.
    if (response?.warning) {
      window.alert(response.warning);
    }

    // Refresh the current route to reflect the changes in the UI.
    router.refresh();
  };

  return (
    <button
      type='button'
      onClick={handleDelete}
      disabled={isDeleting}
      // Apply styles for the button, including a disabled state.
      className='shrink-0 rounded-full border border-red-300 px-4 py-1 text-sm font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50 cursor-pointer'
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}

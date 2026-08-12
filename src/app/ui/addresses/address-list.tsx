'use client';

import type { Address } from "@/types/address";

/**
 * Defines the props for the AddressList component.
 */
interface AddressListProps {
  // An array of address objects to display.
  addresses: Address[];
  // An optional callback function to handle when an address is selected.
  onSelect?: (address: Address) => void;
  // The ID of the currently selected address, used for styling.
  selectedId?: string;
  // An optional function that returns a React node (e.g., buttons) to be displayed for each address.
  actions?: (address: Address) => React.ReactNode;
}

/**
 * A flexible client component for displaying a list of user addresses.
 * It can be used for simple display, for selection (like in a checkout form),
 * or for management (by passing in action buttons).
 * @param {AddressListProps} props - The component props.
 */
export default function AddressList({ addresses, onSelect, selectedId, actions }: AddressListProps) {
  // If there are no addresses, display a placeholder message.
  if (addresses.length === 0) {
    return (
      <div className="p-6 text-center rounded-2xl border border-slate-200 bg-white">
        <p className="text-slate-600">No addresses saved yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map over the addresses and render a card for each one. */}
      {addresses.map((address) => {
        // Determine if the current address is the selected one.
        const isSelected = selectedId === address.id;
        
        return (
          <div 
            key={address.id} 
            // If an onSelect handler is provided, call it on click.
            onClick={() => onSelect?.(address)}
            // Apply dynamic classes for interactivity and selection state.
            className={`p-4 md:p-6 rounded-2xl border bg-white transition-colors ${
              onSelect ? 'cursor-pointer hover:border-brand-primary' : ''
            } ${isSelected ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-slate-200'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {/* Display a "Default" badge if applicable. */}
                {address.is_default && (
                  <span className="mb-2 inline-block rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white">
                    Default
                  </span>
                )}
                <p className="font-bold text-slate-900">{address.full_name}</p>
                <p className="text-slate-700">{address.address_1}</p>
                {address.address_2 && <p className="text-slate-700">{address.address_2}</p>}
                <p className="text-slate-700">
                  {address.city}, {address.state} {address.zip_code}
                </p>
              </div>
              
              {/* If an actions function is provided, render its output. */}
              {actions && (
                <div className="flex shrink-0 gap-2">
                  {actions(address)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
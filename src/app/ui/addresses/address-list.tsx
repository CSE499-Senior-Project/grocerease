'use client';

import type { Address } from "@/types/address";

interface AddressListProps {
  addresses: Address[];
  onSelect?: (address: Address) => void;
  selectedId?: string;
  actions?: (address: Address) => React.ReactNode;
}

export default function AddressList({ addresses, onSelect, selectedId, actions }: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="p-6 text-center rounded-2xl border border-slate-200 bg-white">
        <p className="text-slate-600">No addresses saved yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => {
        const isSelected = selectedId === address.id;
        
        return (
          <div 
            key={address.id} 
            onClick={() => onSelect?.(address)}
            className={`p-4 md:p-6 rounded-2xl border bg-white transition-colors ${
              onSelect ? 'cursor-pointer hover:border-brand-primary' : ''
            } ${isSelected ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-slate-200'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
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
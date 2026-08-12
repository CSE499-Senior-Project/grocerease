import { type ElementType } from 'react';
import { signOut } from '@/actions/actions';

/**
 * Renders a sign-out button wrapped in a form.
 * When submitted, the form triggers the `signOut` server action to log the user out.
 * It can optionally display an icon next to the "Sign Out" text.
 */
export default function SignOutButton({ icon: Icon }: { icon?: ElementType } = {}) {
  return (
    <form action={signOut}>
      <button
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-brand-light hover:text-brand-primary cursor-pointer"
        type="submit"
      >
        {Icon && <Icon className="h-5 w-5" />}
        Sign Out
      </button>
    </form>
  );
}
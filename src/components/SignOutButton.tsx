import { signOut } from '@/app/auth/signout/route';

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button 
        className="block w-full px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-brand-light hover:text-brand-primary cursor-pointer"
        type="submit"
      >
        Sign Out
      </button>
    </form>
  );
}
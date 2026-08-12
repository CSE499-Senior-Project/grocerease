import AccountCard from '@/app/ui/account/account-card';
import PageTitle from '@/app/ui/account/page-title';

/**
 * Defines the props for the ComingSoon component.
 */
interface ComingSoonProps {
  // The title of the feature that is coming soon.
  title: string;
}

/**
 * A placeholder component to indicate that a feature is not yet available.
 * It displays the feature's title and a "Coming soon" message inside a card.
 * @param {ComingSoonProps} props - The component props.
 */
export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <>
      <PageTitle>{title}</PageTitle>

      <AccountCard className="p-6 text-center">
        <p className="text-slate-600">This feature is coming soon.</p>
      </AccountCard>
    </>
  );
}
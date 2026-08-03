import AccountCard from '@/app/ui/account/account-card';
import PageTitle from '@/app/ui/account/page-title';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <PageTitle>{title}</PageTitle>

      <AccountCard className="p-6 text-center">
        <p className="text-slate-600">This feature is coming soon.</p>
      </AccountCard>
    </>
  );
}

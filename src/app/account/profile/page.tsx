import type { Metadata } from "next";
import Link from "next/link";
import { getAuthenticatedProfile } from "@/lib/profile";
import DetailRow from "@/app/ui/account/detail-row";
import AccountCard from "@/app/ui/account/account-card";
import PageTitle from "@/app/ui/account/page-title";

export const metadata: Metadata = {
  title: "Account Details",
};

const contactMethodLabels = {
  email: "Email",
  phoneNumber: "Phone",
};

export default async function AccountDetailsPage() {
  const profile = await getAuthenticatedProfile();

  return (
    <>
      <PageTitle
        action={
          <Link
            href="/account/profile/edit"
            className="shrink-0 rounded-full border border-brand-primary px-4 py-1 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
          >
            Edit
          </Link>
        }
      >
        Account Details
      </PageTitle>

      <AccountCard>
        <DetailRow label="Email" value={profile.email} />
        <DetailRow label="Name" value={`${profile.first_name} ${profile.last_name}`} />
        <DetailRow label="Phone Number" value={profile.phone_number || "Not provided"} />
        <DetailRow
          label="Preferred Contact Method"
          value={contactMethodLabels[profile.preferred_contact_method]}
        />
      </AccountCard>
    </>
  );
}

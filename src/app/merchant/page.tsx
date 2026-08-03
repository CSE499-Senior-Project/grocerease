import { getProfile } from "@/lib/profile";
import { redirect } from "next/navigation";

export default async function MerchantPage() {
  const profile = await getProfile();
  
  const isAdmin = profile?.role === 'merchant' || profile?.role === 'admin';

  if (isAdmin) {
    redirect("/merchant/profile");
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12 mt-10">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
        Partner with GrocerEase
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
        We are excited that you are interested in becoming a merchant. Please reach out to our team, and we will be in contact shortly to get you set up.
      </p>
      <div className="mt-8 flex justify-center">
        <a
          href="mailto:become.a.merchant@gmail.com"
          className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-2"
        >
          Email our team
        </a>
      </div>
    </div>
  );
}
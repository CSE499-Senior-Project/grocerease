import { Metadata } from "next";
import SignInForm from "@/app/ui/signin/signin-form";
import Footer from "@/components/Footer";
export const metadata: Metadata = {
  title: 'Sign In',
};

export default function SignInPage(){
  return (
    <div className="flex w-full items-stretch items-center bg-hero-login bg-cover bg-center rounded-2xl bg-no-repeat max-w-[1039px] min-h-[612px] overflow-hidden">
      <div className="flex w-full h-full flex-col items-center justify-end md:flex-row md:items-stretch md:justify-end">
        <div className="flex w-full h-full max-w-[450px] flex-col justify-center md:w-1/2">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
import { Metadata } from "next";
import SignUpForm from "@/app/ui/signup/signup-form";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignUpPage(){
  return (
    <div className="flex w-full items-stretch items-center md:p-24justify-center bg-hero-login bg-cover bg-center rounded-2xl bg-no-repeat max-w-[1039px] min-h-[612px] overflow-hidden">
      <div className="flex w-full h-full flex-col items-center justify-end md:flex-row md:items-stretch md:justify-end">
        <div className="flex w-full h-full max-w-[450px] flex-col justify-center md:w-1/2">
          <Suspense>
            <SignUpForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
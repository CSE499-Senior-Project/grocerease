import { Metadata } from "next";
import SignUpForm from "@/app/ui/signup/signup-form";
import { Suspense } from "react";

/**
 * Metadata for the Sign Up page.
 * This sets the title that appears in the browser tab.
 */
export const metadata: Metadata = {
  title: 'Sign Up',
};

/**
 * The sign-up page component.
 * This page displays the sign-up form within a styled container.
 */
export default function SignUpPage(){
  return (
    // Main container with a background image and centered content.
    <div className="my-8 flex w-full items-stretch items-center bg-hero-login bg-cover bg-center rounded-2xl bg-no-repeat max-w-[1039px] min-h-[612px] overflow-hidden">
      <div className="flex w-full h-full flex-col items-center justify-end md:flex-row md:items-stretch md:justify-end">
        {/* This div contains the form and aligns it to the right on medium screens and up. */}
        <div className="flex w-full h-full max-w-[450px] flex-col justify-center md:w-1/2">
          {/* Suspense is used here to allow the SignUpForm to be loaded asynchronously, showing a fallback UI if needed. */}
          <Suspense>
            <SignUpForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
import { Metadata } from "next";
// import { redirect } from "next/navigation";
import LoginForm from "../ui/login/login-form";
import Image1 from "@/components/image1"
// import { auth } from "@/auth";

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage(){
  return (
    <div className="flex w-full items-center justify-center py-16 md:py-24 bg-hero-login bg-cover bg-center rounded-2xl bg-no-repeat max-w-[1039px] max-h-[612px] h-full">
      <div className="flex w-full max-w-5x1 flex-col items-center justify-start gap-8 md:flex-row md:items-stretch md:gap-12">
        {/* <div className="relative hidden w-full flex-1 items-center justify-center overflow-hidden md:flex md:w-1/2">
          <Image1 />
        </div> */}
        <div className="flex w-full max-w-[450px] flex-col justify-center md:w-1/2">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
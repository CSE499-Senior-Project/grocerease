import { Metadata } from "next";
// import { redirect } from "next/navigation";
import RegisterForm from "@/app/ui/register/register-form";

export const metadata: Metadata = {
  title: 'Register',
};

export default function LoginPage(){
  return (
    <div className="flex w-full items-stretch items-center md:p-24justify-center bg-hero-login bg-cover bg-center rounded-2xl bg-no-repeat max-w-[1039px] min-h-[612px] overflow-hidden">
      <div className="flex w-full h-full flex-col items-center justify-end md:flex-row md:items-stretch md:justify-end">
        <div className="flex w-full h-full max-w-[450px] flex-col justify-center md:w-1/2">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
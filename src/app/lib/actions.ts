'use server';

import { redirect } from "next/navigation";
import { type RegistrationData } from "@/types/profile";

export async function registerUser(data: RegistrationData) {
  try {
    redirect('/login?registered=true');
  }
  catch (error) {

  }
}
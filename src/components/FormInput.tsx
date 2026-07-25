import { UseFormRegister, FieldError } from "react-hook-form";
import { type ElementType } from "react";
import { type RegistrationData } from "@/types/profile";

interface FormInputProps {
  label: string;
  name: keyof RegistrationData;
 register: UseFormRegister<RegistrationData>;
 error?: FieldError;
 type?: string;
 placeholder?: string;
 autoComplete?: string;
 icon?: ElementType;
}

export default function FormInput({ 
  label,
  name,
  register,
  error,
  type = "text",
  placeholder,
  autoComplete,
  icon: Icon,
}: FormInputProps) {

  return (
    <div>
      <label className="mb-3 mt-5 block text-s font-semibold uppercase tracking-wider text-txt-primary" htmlFor={name}>
        {label}
      </label>

      <div className='relative'>
        <input
          {...register(name)}
          type={type}
          id={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className='peer block w-full rounded-md border border-brand-primary py-[9px] pl-10 pr-10 text-sm placeholder:text-green-700 focus:outline-brand-primary bg-surface-bg focus:text-txt-primary' 
        /> {/* defaultValue={} />*/}
        {Icon && (
          <Icon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-green-800 peer-focus:text-green-400' />
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}
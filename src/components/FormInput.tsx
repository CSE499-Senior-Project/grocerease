import { UseFormRegister, FieldError, FieldValues, Path } from "react-hook-form";
import { type ElementType } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  icon?: ElementType;
  icon2?: ElementType;
  onIcon2Click?: () => void;
  uppercase?: boolean;
  step?: number;
}

export default function FormInput<T extends FieldValues>({
  label,
  name,
  register,
  error,
  type = "text",
  step,
  placeholder,
  autoComplete,
  icon: Icon,
  icon2: Icon2,
  onIcon2Click,
  uppercase = true,
}: FormInputProps<T>) {

  return (
    <div>
      <label
        className={`mb-3 mt-5 block text-txt-primary ${
          uppercase ? 'text-s font-semibold uppercase tracking-wider' : 'font-bold'
        }`}
        htmlFor={name}
      >
        {label}
      </label>

      <div className='relative'>
        <input
          {...register(name)}
          type={type}
          id={name}
          step={step}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className='peer block w-full rounded-md border border-brand-primary py-[9px] pl-10 pr-10 text-sm placeholder:text-green-700 focus:outline-brand-primary bg-surface-bg focus:text-txt-primary' 
        />
        {Icon && (
          <Icon className='pointer-events-none absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-green-800 peer-focus:text-green-400' />
        )}
        <button
          type="button"
          onClick={onIcon2Click}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-green-800 hover:text-green-400 focus:outline-none cursor-pointer"
        >
          {Icon2 && (
            <Icon2 className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && (
        <div className="mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className='pointer-events-none h-[18px] text-red-700' />
          <p className="text-sm text-red-700 font-semibold">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
}
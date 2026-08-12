'use client';

import { useForm } from "react-hook-form";
import { updateOrderStatus } from "@/actions/merchant";

const STATUS_STEPS = ['pending', 'shopping', 'out for delivery', 'delivered'] as const;
type OrderStatus = typeof STATUS_STEPS[number];

interface OrderStatusStepperProps {
  orderId: string;
  currentStatus: OrderStatus;
}

type FormData = {
  status: OrderStatus;
};

export default function OrderStatusStepper({ orderId, currentStatus }: OrderStatusStepperProps) {
  const {
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormData>();

  /**
   * Handles the form submission to update the order status.
   * It calls a server action `updateOrderStatus` with the order ID and the new status.
   */
  const onSubmit = async (data: FormData) => {
    const response = await updateOrderStatus(orderId, data.status);

    if (response?.error) {
      setError('root', { message: response.error });
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {errors.root && (
        <p className="text-sm font-semibold text-red-600">
          {errors.root.message}
        </p>
      )}
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full items-center gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide"
      >
        {/* Renders a button for each possible status step. */}
        {STATUS_STEPS.map((step, index) => {
          const currentIdx = STATUS_STEPS.indexOf(currentStatus);
          const isPast = index < currentIdx;
          const isCurrent = index === currentIdx;

          // Dynamically determines button styling based on its relation to the current status.
          let buttonClasses =
            "shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold capitalize transition-all ";

          if (isCurrent) {
            buttonClasses += "border-brand-primary bg-brand-primary text-white shadow-md";
          } else if (isPast) {
            buttonClasses +=
              "border-brand-light bg-brand-light text-brand-dark hover:bg-brand-primary hover:text-white hover:border-brand-primary cursor-pointer";
          } else {
            buttonClasses +=
              "border-slate-200 bg-white text-slate-400 hover:border-brand-primary hover:text-brand-primary cursor-pointer";
          }

          return (
            <div key={step} className="flex shrink-0 items-center gap-2">
              <button
                type="submit"
                // On click, the form's 'status' value is set, and the form is submitted.
                onClick={() => setValue("status", step)}
                disabled={isCurrent || isSubmitting}
                className={buttonClasses}
                aria-label={`Update status to ${step}`}
              >
                {step}
              </button>

              {/* Renders a connector line between status steps. */}
              {index < STATUS_STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-4 sm:w-6 rounded-full ${
                    isPast ? "bg-brand-primary" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </form>
    </div>
  );
}

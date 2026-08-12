// Defines the possible order statuses in their logical sequence.
const STATUS_STEPS = ['pending', 'shopping', 'out for delivery', 'delivered'] as const;
type OrderStatus = typeof STATUS_STEPS[number];

/**
 * Defines the props for the OrderStatusTrack component.
 */
interface OrderStatusTrackProps {
  // The current status of the order.
  currentStatus: OrderStatus;
}

/**
 * A visual component that displays the progress of an order through a series of status steps.
 * @param {OrderStatusTrackProps} props - The component props.
 */
export default function OrderStatusTrack({ currentStatus }: OrderStatusTrackProps) {
  // Find the index of the current status in the sequence.
  const currentIdx = STATUS_STEPS.indexOf(currentStatus);

  return (
    // Container that allows horizontal scrolling on small screens without showing a scrollbar.
    <div className="flex w-full items-center justify-center gap-0.5 overflow-x-auto pb-1 scrollbar-hide">
      {STATUS_STEPS.map((step, index) => {
        // Determine if the step is in the past or is the current step.
        const isPast = index < currentIdx;
        const isCurrent = index === currentIdx;

        let badgeClasses =
          'shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-bold capitalize ';

        // Apply different styles based on whether the step is past, current, or future.
        if (isCurrent) {
          badgeClasses += 'border-brand-primary bg-brand-primary text-white shadow-md';
        } else if (isPast) {
          badgeClasses += 'border-brand-light bg-brand-light text-brand-dark';
        } else {
          badgeClasses += 'border-slate-200 bg-white text-slate-400';
        }

        return (
          <div key={step} className="flex items-center gap-0.5">
            <span className={badgeClasses}>{step}</span>

            {/* Render a connector line between steps, but not after the last one. */}
            {index < STATUS_STEPS.length - 1 && (
              <div
                // The connector is colored if it's between past steps.
                className={`h-px w-1.5 sm:w-2 shrink-0 rounded-full ${
                  isPast ? 'bg-brand-primary' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const STATUS_STEPS = ['pending', 'shopping', 'out for delivery', 'delivered'] as const;
type OrderStatus = typeof STATUS_STEPS[number];

interface OrderStatusTrackProps {
  currentStatus: OrderStatus;
}

export default function OrderStatusTrack({ currentStatus }: OrderStatusTrackProps) {
  const currentIdx = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="flex w-full items-center justify-center gap-0.5 overflow-x-auto pb-1 scrollbar-hide">
      {STATUS_STEPS.map((step, index) => {
        const isPast = index < currentIdx;
        const isCurrent = index === currentIdx;

        let badgeClasses =
          'shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-bold capitalize ';

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

            {index < STATUS_STEPS.length - 1 && (
              <div
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

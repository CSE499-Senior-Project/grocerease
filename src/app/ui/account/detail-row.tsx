/**
 * Defines the props for the DetailRow component.
 */
interface DetailRowProps {
  // The label for the piece of data (e.g., "Email").
  label: string;
  // The value of the data (e.g., "user@example.com").
  value: string;
}

/**
 * A component for displaying a single key-value pair of information,
 * typically used on a user's profile or details page.
 * @param {DetailRowProps} props - The component props.
 */
export default function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className='flex items-center justify-between border-b border-slate-200 px-4 py-4 last:border-b-0 sm:px-6'>
      <div>
        <p className='font-bold text-slate-900'>{label}:</p>
        <p className='text-slate-700'>{value}</p>
      </div>
    </div>
  );
}

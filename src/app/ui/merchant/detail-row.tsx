export default function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className='flex items-center justify-between border-b border-slate-200 px-4 py-4 last:border-b-0 sm:px-6'>
      <div>
        <p className='font-bold text-slate-900'>{label}:</p>
        <p className='text-slate-700'>{value}</p>
      </div>
    </div>
  );
}

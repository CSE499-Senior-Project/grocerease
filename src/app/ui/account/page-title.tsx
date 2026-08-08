export default function PageTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <h1 className="text-3xl font-bold text-slate-900">{children}</h1>
      {action}
    </div>
  );
}

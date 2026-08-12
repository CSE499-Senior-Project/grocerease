/**
 * Defines the props for the PageTitle component.
 */
interface PageTitleProps {
  // The main text content of the title.
  children: React.ReactNode;
  // An optional React node (like a button or link) to display alongside the title.
  action?: React.ReactNode;
}

/**
 * A reusable component for displaying a consistent page title across the account section.
 * It includes a slot for an optional action element, like an "Edit" or "Add" button.
 * @param {PageTitleProps} props - The component props.
 */
export default function PageTitle({ children, action }: PageTitleProps) {
  return (
    <div className='mb-6 flex items-center justify-between gap-3'>
      <h1 className='text-3xl font-bold text-slate-900'>{children}</h1>
      {action}
    </div>
  );
}

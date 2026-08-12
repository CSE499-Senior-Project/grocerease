/**
 * Defines the props for the AccountCard component.
 */
interface AccountCardProps {
  // The content to be rendered inside the card.
  children: React.ReactNode;
  // Optional additional CSS classes to apply to the card.
  className?: string;
}

/**
 * A reusable UI component that provides a styled container (a "card")
 * for content within the account management sections of the application.
 * @param {AccountCardProps} props - The component props.
 */
export default function AccountCard({
  children,
  className = '',
}: AccountCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white ${className}`}
    >
      {children}
    </div>
  );
}

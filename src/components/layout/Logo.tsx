import Image from "next/image";
import Link from "next/link";

/**
 * Renders the application's logo as a link to the homepage.
 * It uses the Next.js Image component for optimized image loading.
 */
export default function Logo() {
  return (
    <Link href="/" aria-label="GrocerEase home">
      <Image
        src="/images/horizontal_logo.png"
        alt="GrocerEase"
        width={162}
        height={40}
        priority
      />
    </Link>
  );
}

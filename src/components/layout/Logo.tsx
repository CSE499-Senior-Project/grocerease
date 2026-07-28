import Image from "next/image";
import Link from "next/link";

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
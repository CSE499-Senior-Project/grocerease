import Image from "next/image";

export default function Image1() {
  return (
    <Image 
      src='/images/shoppingcart.webp'
      alt='Shopping Cart Image'
      fill
      priority
      className="object-cover rounded-[2rem]"
      sizes='(max-width: 768px) 100vw, 50vw'
    />
  )
}
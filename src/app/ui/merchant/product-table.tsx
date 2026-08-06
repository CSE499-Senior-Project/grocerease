'use client';

import Image from "next/image";
import { MerchantProduct } from "@/types/merchant-products";

interface ProductTableProps {
  products: MerchantProduct[];
}

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Product Description</th>
          <th>Price</th>
          <th>Unit</th>
          <th>Stock Quantity</th>
          <th>Is Product Active?</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between gap-4 py-3"
          >
            <tr>            
              <td>
                  <div className="flex items-center">
                    <div>
                      {/* <Image
                        src={
                          product.image_url ??
                          "/images/products/placeholder.webp"
                        }
                        alt={product.name ?? "Product"}
                        fill
                        sizes="48px"
                        className="object-cover"
                      /> */}
                    </div>
                    <div>
                      <div>
                        {product.name}
                      </div>
                    </div>
                  </div>
              </td>
              <td>
                {product.description}
              </td>
              <td>
                $ {product.price.toFixed(2)}
              </td>
              <td>
                {product.unit}
              </td>
              <td>
                {product.stock_quantity}
              </td>
              <td>
                {product.is_active}
              </td>
            </tr>
          </li>
        ))}
      </tbody>
    </table>
  );
}
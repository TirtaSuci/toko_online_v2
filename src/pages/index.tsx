import { products } from "@/types/products.type";
import { useState } from "react";

export default function Home() {
const product: products[] = [];
const [productsData, setProductsData] = useState<products[]>([]);

  return (
  <>
    <div>
      {productsData.map((product : products, index : number) => (
        <div key={index}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  </>
  );
}

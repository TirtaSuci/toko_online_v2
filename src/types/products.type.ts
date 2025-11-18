export type products = {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: {
    size: string;
    qty: number;
  }[];
  brand: string;
  category: string;
  thumbnail: string;
  image: string;
};

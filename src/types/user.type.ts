export type user = {
  id?: string;
  email: string;
  fullname: string;
  role: string;
  image?: string;
  phone?: string;
  updatedAt?: Date;
  createdAt?: Date;
  password?: string;
  token?: string;
  type?: string;
  transaction?: {
    address: {
      reciptien: string;
      phone: string;
      address: string;
    };
    cart: {
      productId: string;
      qty: number;
      size: string;
    }[];
    order_id: string;
    total: number;
    status: string;
    transaction_date: Date;
    token: string;
    redirect_url: string;
  }[];
};

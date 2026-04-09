import Button from "@/components/layouts/UI/Button";
import style from "./Order.module.scss";
import { useEffect, useState } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import userServices from "@/Services/user";
import { user } from "@/types/user.type";
import converIDR from "@/utils/currency";
import productServices from "@/Services/products";
import { products } from "@/types/products.type";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/router";

const OrderUserView = () => {
  const [profile, setProfile] = useState<Partial<user> | null>(null);
  const [products, setProducts] = useState<Partial<products>[] | null>(null);
  const {push} = useRouter();

  const getProfile = async () => {
    const response = await userServices.getProfile(); setProfile(response.data.data);
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getAllProducts = async () => {
    const response = await productServices.getAllProducts();
    setProducts(response.data.data);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const getProduct = (productId: string) => {
    return (
      products?.find((product) => product.id === String(productId)) || null
    );
  };

  return (
    <UserLayout>
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <div className={style.Users}>
        <h1>Order View</h1>
        {profile?.transaction && profile.transaction.length > 0 ? (
          <table className={style.Users__table}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Item</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {profile.transaction.map((transaction: { order_id: string; cart?: { productId: string; qty: number; size: string }[]; total: number; status: string; token?: string }, index: number) => (
                <tr key={transaction.order_id}>
                  <td>{index + 1}</td>

                  <td>
                    {transaction.cart?.map((item: { productId: string; qty: number; size: string }, index: number) => (
                      <div key={index} className={style.Users__table__cartItem}>
                        <Image
                          src={getProduct(item.productId)?.image || "/placeholder.png"}
                          alt={getProduct(item.productId)?.name || "Product Image"}
                          width={60}
                          height={60}
                        />
                        <div className={style.Users__table__cartItem__info}>
                          <p className={style.Users__table__cartItem__name}>
                            {getProduct(item.productId)?.name || "Unknown Product"}
                          </p>
                          <p className={style.Users__table__cartItem__desc}>
                            {getProduct(item.productId)?.description || "No description available"}
                          </p>
                          <p className={style.Users__table__cartItem__qty}>
                            Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                    ))}
                  </td>

                  <td>{converIDR(transaction.total)}</td>
                  <td>{transaction.status}</td>

                  <td>
                    <div className={style.Users__table__action}>
                      <Button
                        type="button"
                        className={
                          transaction.status === "success" ||
                            transaction.status === "settlement"
                            ? `${style.Users__table__action__button} ${style.Users__table__action__button__success}`
                            : style.Users__table__action__button__delete
                        }
                        onClick={() => window.snap.pay(transaction.token)}
                        disabled={transaction.status !== "pending"}
                      >
                        {transaction.status === "pending" ? "Pay Now" : "Success"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={style.Users__orderEmpty}>
            <p className={style.Users__orderEmpty__text}>
              Silahkan order terlebih dahulu
            </p>
            <Button className={style.Users__orderEmpty__button} onClick={() => push("/products") }>
              Order
            </Button>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default OrderUserView;

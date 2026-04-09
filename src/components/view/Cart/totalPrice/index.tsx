import Button from "@/components/layouts/UI/Button";
import { products } from "@/types/products.type";
import converIDR from "@/utils/currency";
import style from "./totalPrice.module.scss";
import Link from "next/link";

type Propstype = {
    cart: { productId: string; qty: number; size: string; }[];
    products: products[] | null;
}
const TotalPrice = (props: Propstype) => {
    const { cart, products } = props;
    const getProduct = (productId: string) => {
        return products?.find((product) => product.id === String(productId)) || null;
    }

    const totalPrice = cart.reduce(
        (acc: number, item: { productId: string; qty: number; size: string; }) => {
            const product = getProduct(item.productId);
            return acc + (product ? product.price * item.qty : 0);
        }, 0);


    return (
        <div className={style.totalPrice}>
            <p className={style.totalPrice__title}>Summary</p>
            <div className={style.totalPrice__container}>
                <div>
                    <p>Subtotal</p>
                    <p>{converIDR(totalPrice)}</p>
                </div>
                <div>
                    <p>Shipping Fee</p>
                    <p>{converIDR(0)}</p>
                </div>
                <hr />
                <div>
                    <p>Total</p>
                    <p>{converIDR(totalPrice)}</p>
                </div>
                <hr />
            </div>
            <Link href="/checkout">
                <Button>Checkout</Button>
            </Link>
        </div>
    );
}
export default TotalPrice;
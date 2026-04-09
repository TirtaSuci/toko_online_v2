import { products } from "@/types/products.type";
import style from "./detailCheckOut.module.scss";
import Image from "next/image";
import converIDR from "@/utils/currency";

type Proptype = {
    products: products[] | null;
    cart: { productId: string; qty: number; size: string }[] | undefined;
    setCart: (cart: { productId: string; qty: number; size: string }[]) => void;
};

const DetailCart = (props: Proptype) => {
    const { products, cart } = props;

    const getProduct = (productId: string) => {
        return (
            products?.find((product) => product.id === String(productId)) || null
        );
    };

    return (
        <div className={style.CheckOut}>
            <p className={style.CheckOut__title}>Bag</p>
            <div>
                {cart?.map((item: { productId: string; qty: number; size: string }) => (
                    <div
                        key={`${item.productId}-${item.size}`}
                        className={style.CheckOut__container__item__card}
                    >
                        <div className={style.CheckOut__container__item__card__data}>
                            <div
                                className={style.CheckOut__container__item__card__data__product}
                            >
                                <Image
                                    src={getProduct(item.productId)?.image || "/placeholder.png"}
                                    alt={getProduct(item.productId)?.name || "Product Image"}
                                    width={100}
                                    height={100}
                                />
                                <div
                                    className={
                                        style.CheckOut__container__item__card__data__product__font
                                    }
                                >
                                    <p>{getProduct(item.productId)?.name || "Product Name"}</p>
                                    <div
                                        className={
                                            style.CheckOut__container__item__card__data__product__font__color
                                        }
                                    >
                                        <p>
                                            {getProduct(item.productId)?.category ||
                                                "Product Category"}
                                        </p>
                                        <p>Size {item.size}</p>
                                        {/* <p>{converIDR(getProduct(item.productId)?.price || 0)}</p> */}
                                    </div>
                                </div>
                            </div>
                            <div className={style.CheckOut__container__item__card__price}>
                                <p>
                                    {converIDR(
                                        (getProduct(item.productId)?.price || 0) * item.qty,
                                    )}
                                </p>
                            </div>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default DetailCart;

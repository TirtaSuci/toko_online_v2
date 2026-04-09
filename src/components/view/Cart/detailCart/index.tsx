import { products } from "@/types/products.type";
import style from "./detailCart.module.scss";
import Image from "next/image";
import converIDR from "@/utils/currency";
import userServices from "@/Services/user";
import { useContext } from "react";
import { ToasterContext } from "@/context/ToasterContexts";

type Proptype = {
    products: products[] | null;
    cart: { productId: string; qty: number; size: string }[] | undefined;
    setCart: (cart: { productId: string; qty: number; size: string }[]) => void;
};

const DetailCart = (props: Proptype) => {
    const { products, cart, setCart } = props;
    const { setToaster } = useContext(ToasterContext);

    const getProduct = (productId: string) => {
        return (
            products?.find((product) => product.id === String(productId)) || null
        );
    };

    const handleDeleteCartItem = async (productId: string, size: string) => {
        if (!cart) return;
        const newCart = cart.filter(
            (item) => !(item.productId === productId && item.size === size),
        );
        try {
            const result = await userServices.addToCart({
                carts: newCart,
            });
            if (result.status === 200) {
                setCart(newCart);
                setToaster({
                    variant: "success",
                    message: "Item removed from cart successfully",
                });
            } else {
                setToaster({
                    variant: "error",
                    message: "Failed to remove item from cart",
                });
            }
        } catch (error) {
            console.error("Failed to update cart in localStorage:", error);
        }
    };

    const handleDecreaseCartItem = async (productId: string, size: string) => {
        if (!cart) return;
        const newCart = cart.map((item) => {
            if (item.productId === productId && item.size === size) {
                item.qty -= 1;
            }
            return item;
        });
        try {
            const result = await userServices.addToCart({
                carts: newCart,
            });
            if (result.status === 200) {
                setCart(newCart);
            } else {
                setToaster({
                    variant: "error",
                    message: "Failed to remove item from cart",
                });
            }
        } catch (error) {
            console.error("Failed to update cart in localStorage:", error);
        }
    };

    const handleIncreaseCartItem = async (productId: string, size: string) => {
        if (!cart) return;
        const newCart = cart.map((item) => {
            if (item.productId === productId && item.size === size) {
                item.qty += 1;
            }
            return item;
        });
        try {
            const result = await userServices.addToCart({
                carts: newCart,
            });
            if (result.status === 200) {
                setCart(newCart);
            } else {
                setToaster({
                    variant: "error",
                    message: "Failed to remove item from cart",
                });
            }
        } catch (error) {
            console.error("Failed to update cart in localStorage:", error);
        }
    };

    return (
        <div className={style.CartView}>
            <p className={style.CartView__title}>Bag</p>
            <div>
                {cart?.map((item: { productId: string; qty: number; size: string }) => (
                    <div
                        key={`${item.productId}-${item.size}`}
                        className={style.CartView__container__item__card}
                    >
                        <div className={style.CartView__container__item__card__data}>
                            <div
                                className={style.CartView__container__item__card__data__product}
                            >
                                <Image
                                    src={getProduct(item.productId)?.image || "/placeholder.png"}
                                    alt={getProduct(item.productId)?.name || "Product Image"}
                                    width={150}
                                    height={150}
                                />
                                <div
                                    className={
                                        style.CartView__container__item__card__data__product__font
                                    }
                                >
                                    <p>{getProduct(item.productId)?.name || "Product Name"}</p>
                                    <div
                                        className={
                                            style.CartView__container__item__card__data__product__font__color
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
                            <div className={style.CartView__container__item__card__price}>
                                <p>
                                    {converIDR(
                                        (getProduct(item.productId)?.price || 0) * item.qty,
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className={style.CartView__container__item__card__qty}>
                            <div>
                                {item.qty > 1 ? (
                                    <i
                                        onClick={() =>
                                            handleDecreaseCartItem(item.productId, item.size)
                                        }
                                        className="bx bx-minus"
                                    />
                                ) : (
                                    <i
                                        onClick={() =>
                                            handleDeleteCartItem(item.productId, item.size)
                                        }
                                        className="bx bx-trash"
                                    />
                                )}
                                <span>{item.qty}</span>
                                <i onClick={() => handleIncreaseCartItem(item.productId, item.size)} className="bx bx-plus" />
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

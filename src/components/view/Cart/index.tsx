import { products } from "@/types/products.type";
import style from "./CartView.module.scss";
import DetailCart from "./detailCart";
import TotalPrice from "./totalPrice";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import productServices from "@/Services/products";
import userServices from "@/Services/user";
import { ToasterContext } from "@/context/ToasterContexts";



const CartView = () => {
    const { setToaster } = useContext(ToasterContext);
    const [products, setProducts] = useState<products[] | null>(null);
    const [cart, setCart] = useState<{ productId: string; qty: number; size: string; }[] | undefined>(undefined);
    const session = useSession() as { data?: { accessToken?: string } };
    const isLoading = typeof cart === "undefined";
    const isEmpty = !isLoading && (!cart || cart.length === 0);

    const getAllProducts = async () => {
        const response = await productServices.getAllProducts();
        setProducts(response.data.data);
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    useEffect(() => {
        const token = session?.data?.accessToken;
        if (!token) return;

        const fetchCart = async () => {
            try {
                const response = await userServices.getCart();
                setCart(response.data.data);
            } catch (error) {
                console.error("getCart error:", error);
            }
        };

        fetchCart();
    }, [session.data?.accessToken]);

    useEffect(() => {
        if (typeof cart === "undefined" || products === null) return;

        const valid = (cart || []).filter((item) =>
            products.some((p) => String(p.id) === String(item.productId))
        );

        if (valid.length === (cart || []).length) return;

        const cleanup = async () => {
            try {
                await userServices.addToCart({ carts: valid.map((i) => ({ productId: i.productId, qty: i.qty, size: i.size })) });
                setCart(valid);
                setToaster({ open: true, message: "Removed unavailable items from cart", severity: "info" });
            } catch (err) {
                console.error("Failed to cleanup cart:", err);
                setToaster({ open: true, message: "Failed to clean up cart", severity: "error" });
            }
        };

        cleanup();
    }, [cart, products, setToaster]);


    return (
        <div className={style.CartView}>
            <div className={style.CartView__title}><p>Cart</p></div>
            <div className={style.CartView__container}>
                <div className={isEmpty ? style.CartView__container__empty : style.CartView__container__item}>
                    {isLoading ? (
                        <p>Loading cart…</p>
                    ) : isEmpty ? (
                        <div className={style.CartView__container__empty__content}>
                            <p>Your cart is empty.</p>
                            <p>Please add some products to your cart.</p>
                            <Link href="/products">Go Products Page</Link>
                        </div>
                    ) : (
                        <>
                            <DetailCart products={products} cart={cart} setCart={setCart} />
                            <TotalPrice cart={cart} products={products} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartView
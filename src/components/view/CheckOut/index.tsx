import { products } from "@/types/products.type";
import style from "./CheckOut.module.scss";
import DetailCart from "./detailCheckOut";
import TotalPrice from "./totalPrice";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import productServices from "@/Services/products";
import userServices from "@/Services/user";
import { ToasterContext } from "@/context/ToasterContexts";
import AddressView from "./Address";
import { ProfileType } from "@/types/profile.type";

const CheckOutView = () => {
    const { setToaster } = useContext(ToasterContext);
    const [products, setProducts] = useState<products[] | null>(null);
    const [cart, setCart] = useState<
        { productId: string; qty: number; size: string }[] | undefined
    >(undefined);
    const session = useSession() as { data?: { accessToken?: string } };
    const isLoading = typeof cart === "undefined";
    const isEmpty = !isLoading && (!cart || cart.length === 0);
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [mainAddress, setMainAddress] = useState(0);

    const getAllProducts = async () => {
        const response = await productServices.getAllProducts();
        setProducts(response.data.data);
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    const getProfile = async () => {
        const response = await userServices.getProfile();
        setProfile(response.data.data);
    };

    useEffect(() => {
        getProfile();
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
            products.some((p) => String(p.id) === String(item.productId)),
        );

        if (valid.length === (cart || []).length) return;

        const cleanup = async () => {
            try {
                await userServices.addToCart({
                    carts: valid.map((i) => ({
                        productId: i.productId,
                        qty: i.qty,
                        size: i.size,
                    })),
                });
                setCart(valid);
                setToaster({
                    open: true,
                    message: "Removed unavailable items from cart",
                    severity: "info",
                });
            } catch (err) {
                console.error("Failed to cleanup cart:", err);
                setToaster({
                    open: true,
                    message: "Failed to clean up cart",
                    severity: "error",
                });
            }
        };

        cleanup();
    }, [cart, products, setToaster]);

    useEffect(() => {
        if (!profile?.address || profile.address.length === 0) return;

        if (!Array.isArray(profile.address)) {
            setMainAddress(0);
        } else {
            profile.address.filter((address: { isMain: boolean }, id: number) => {
                if (address.isMain) {
                    setMainAddress(id);
                }
            });
        }
    }, [profile?.address]);

    return (
        <>
            <div className={style.CheckOut}>
                <div className={style.CheckOut__title}>
                    <p>Checkout</p>
                </div>
                <div className={style.CheckOut__container}>
                    <div
                        className={
                            isEmpty
                                ? style.CheckOut__container__empty
                                : style.CheckOut__container__item
                        }
                    >
                        {isLoading ? (
                            <p>Loading Item…</p>
                        ) : isEmpty ? (
                            <div className={style.CheckOut__container__empty__content}>
                                <p>Your cart is empty.</p>
                                <p>Please add some products to your cart.</p>
                                <Link href="/products">Go Products Page</Link>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <AddressView setSelectedAddress={setMainAddress} />
                                    <DetailCart
                                        products={products}
                                        cart={cart}
                                        setCart={setCart}
                                    />
                                </div>
                                <TotalPrice cart={cart} products={products} profile={profile} mainAddress={mainAddress} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckOutView;

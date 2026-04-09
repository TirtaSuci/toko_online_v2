"use client";

import Button from "@/components/layouts/UI/Button";
import { products } from "@/types/products.type";
import converIDR from "@/utils/currency";
import style from "./totalPrice.module.scss";
import Script from "next/script";
import transactionService from "@/Services/transaction";
import { ProfileType } from "@/types/profile.type";
import { useState } from "react";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        snap: any;
    }
}

type Propstype = {
    cart: { productId: string; qty: number; size: string; }[];
    products: products[] | null;
    profile: ProfileType | null
    mainAddress: number
}
const TotalPrice = (props: Propstype) => {
    const { cart, products, profile, mainAddress } = props;
    const [isSnapLoaded, setIsSnapLoaded] = useState(false);

    const getProduct = (productId: string) => {
        return products?.find((product) => product.id === String(productId)) || null;
    }

    const totalPrice = cart.reduce(
        (acc: number, item: { productId: string; qty: number; size: string; }) => {
            const product = getProduct(item.productId);
            return acc + (product ? product.price * item.qty : 0);
        }, 0);

    const handleCheckout = async () => {
        if (!isSnapLoaded || !window.snap) {
            alert("Payment system not ready, please wait...");
            return;
        }
        const payload = {
            user: {
                fullname: profile?.fullname,
                email: profile?.email,
                phone: profile?.phone,
                address: profile?.address?.[mainAddress],
            },
            transaction: {
                total: totalPrice,
                cart: cart
            }
        }
        const data = await transactionService.generatedTransaction(payload);
        window.snap.pay(data.data.data.token);
    };

    return (
        <>
            <Script
                src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
                strategy="afterInteractive"
                onLoad={() => setIsSnapLoaded(true)}
            />
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
                <Button onClick={handleCheckout} disabled={!isSnapLoaded}>
                    {isSnapLoaded ? "Checkout" : "Loading Payment..."}
                </Button>
            </div>
        </>

    );
}
export default TotalPrice;
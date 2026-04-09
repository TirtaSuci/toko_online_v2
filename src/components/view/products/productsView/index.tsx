import { products } from "@/types/products.type";
import styles from "./productsView.module.scss";
import converIDR from "@/utils/currency";
import ImageView from "./imageView";
import { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/layouts/UI/Button";
import { useRouter } from "next/router";
import userServices from "@/Services/user";
import { ToasterContext } from "@/context/ToasterContexts";

interface CartItem {
    productId: string;
    qty: number;
    size: string;
}

interface Propstype {
    product: products;
    id: string | undefined;
    cart: CartItem[];
}

const DetailProductView = (props: Propstype) => {
    const { product, id, cart = [] } = props;
    const { setToaster } = useContext(ToasterContext);
    const { status } = useSession();
    const router = useRouter();
    const [selectedSize, setSelectedSize] = useState(``);
    const productData = Array.isArray(product) ? product[0] : product;

    const handleAddToCart = async () => {
        if (selectedSize !== `` && id) {
            let newCart = [];
            if (
                cart.filter((item) => item.productId === id && item.size === selectedSize).length > 0
            ) {
                newCart = cart.map((item) => {
                    if (item.productId === id && item.size === selectedSize) {
                        return { ...item, qty: item.qty + 1 };
                    }
                    return item;
                });
            } else {
                newCart = [...cart, { productId: id, qty: 1, size: selectedSize }];
            }
            try {
                const response = await userServices.addToCart({ carts: newCart });
                if (response.status === 200) {
                    setSelectedSize(``);
                    setToaster({
                        variant: "success",
                        message: "Product added to cart successfully!",
                    });
                } else {
                    setToaster({
                        variant: "error",
                        message: "Failed to add product to cart. Please try again.",
                    });
                }
            } catch (error) {
                console.error(error);
                setToaster({
                    variant: "error",
                    message: "Failed to add product to cart. Please try again.",
                });
            }
        }
    };

    return (
        <div className={styles.detailProductView}>
            <ImageView product={product} id={id} />
            <div className={styles.productInfo}>
                <p className={styles.productCategory}>{productData?.category}</p>
                <h1 className={styles.productName}>{productData?.name}</h1>
                <p className={styles.productDescription}>{productData?.description}</p>
                <p className={styles.productPrice}>{converIDR(productData?.price)}</p>

                <div className={styles.divider} />

                <p className={styles.sizeLabel}>Pilih Ukuran</p>
                <div className={styles.productStock}>
                    {productData?.stock?.map((item: { size: string; qty: number }) => (
                        <div key={item.size} className={styles.productStock__sizeOption}>
                            <input
                                type="radio"
                                id={`size-${item.size}`}
                                name="size"
                                disabled={item.qty === 0}
                                onClick={() => setSelectedSize(item.size)}
                                checked={selectedSize === item.size}
                                readOnly
                            />
                            <label htmlFor={`size-${item.size}`}>{item.size}</label>
                        </div>
                    ))}
                </div>

                <Button
                    className={styles.addToCartButton}
                    type={status === "authenticated" ? "submit" : "button"}
                    onClick={() =>
                        status === "authenticated"
                            ? handleAddToCart()
                            : router.push(`/auth/login?callbackUrl=${router.asPath}`)
                    }
                >
                    {status === "authenticated" ? "Add to Cart" : "Login to Add to Cart"}
                </Button>
            </div>
        </div>
    );
};

export default DetailProductView;

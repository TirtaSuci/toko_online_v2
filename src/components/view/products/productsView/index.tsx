
import { products } from "@/types/products.type";
import Image from "next/image";
import styles from "./productsView.module.scss";

interface Propstype {
    product: products | undefined;
}

const DetailProductView = (props: Propstype) => {
    const { product } = props;

    return (
        <div className={styles.detailProductView}>
            <Image
                src={product?.image || ""}
                alt={product?.name || "Product Image"}
                width={400}
                height={400}
                className={styles.productImage}
            />
            <div className={styles.productInfo}>
                <h1 className={styles.productName}>{product?.name}</h1>
                <p className={styles.productDescription}>{product?.description}</p>
                <p className={styles.productPrice}>Price: Rp{product?.price}</p>

                <div className={styles.productStock}>
                    {product?.stock?.map((item: { size: string; qty: number; }) => (
                        <div key={item.size} className={styles.productStock__sizeOption} >
                            <input
                                type="radio"
                                id={`size-${item.size}`}
                                name="size" />
                            <label htmlFor={`size-${item.size}`}>{item.size}</label>
                        </div>
                    ))}
                    
                </div>
            </div>

        </div>
    );
};

export default DetailProductView;
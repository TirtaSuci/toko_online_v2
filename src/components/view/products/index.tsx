import { products } from "@/types/products.type";
import style from "./products.module.scss";
import Image from "next/image";
import Link from "next/link";
import converIDR from "@/utils/currency";

type PropsType = {
    products?: products[];
};

const ProductsView = (props: PropsType) => {
    const { products } = props;

    return (
        <div className={style.products}>
            <div className={style.products__header}>
                <h1 className={style.products__title}>All Products</h1>
                <p className={style.products__subtitle}>
                    Temukan produk terbaik untuk kamu
                </p>
            </div>
            <div className={style.products__main}>
                <aside className={style.products__main__filter}>
                    <h3 className={style.products__main__filter__heading}>
                        Filter
                    </h3>
                    <div className={style.products__main__filter__group}>
                        <div className={style.products__main__filter__item}>
                            <input type="checkbox" id="men" />
                            <label htmlFor="men">Men</label>
                        </div>
                        <div className={style.products__main__filter__item}>
                            <input type="checkbox" id="women" />
                            <label htmlFor="women">Women</label>
                        </div>
                    </div>
                </aside>
                <div className={style.products__main__content}>
                    <p className={style.products__main__count}>
                        Menampilkan {products?.length || 0} produk
                    </p>
                    <div className={style.products__main__grid}>
                        {products?.map((product) => (
                            <Link href={`/products/${product.id}`} key={product.id} style={{ textDecoration: "none" }}>
                                <div className={style.card}>
                                    <div className={style.card__imageWrapper}>
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={300}
                                            height={300}
                                            priority
                                        />
                                    </div>
                                    <div className={style.card__body}>
                                        <p className={style.card__category}>{product.category}</p>
                                        <h2 className={style.card__name}>{product.name}</h2>
                                        <p className={style.card__price}>{converIDR(product.price)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsView;

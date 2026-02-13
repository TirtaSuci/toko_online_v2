import { products } from "@/types/products.type";
import style from "./products.module.scss";
import Image from "next/image";

type PropsType = {
    products: products[];
};
const ProductsView = (props : PropsType) => {
    const { products } = props; 
    return (
        <div className={style.products}>
            <h1 className={style.products__title}>
                All Products
            </h1>
            <div className={style.products__main}>
                <div className={style.products__main__filter}>
                    <div className={style.products__main__filter__data}>
                        <div className={style.products__main__filter__data__title}>
                            Genre
                        </div>
                        <div className={style.products__main__filter__data__list}>
                            <div className={style.products__main__filter__data__list__item}>
                                <input type="checkbox" id="men" />
                                <label htmlFor="men">Men</label>
                            </div>
                            <div className={style.products__main__filter__data__list__item}>
                                <input type="checkbox" id="women" />
                                <label htmlFor="women">Women</label>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className={style.products__main__products}>
                            {products.map((product, index) => (
                                <div key={index} className={style.products__main__products__item}>
                                    <Image src={product.image} alt={product.name} width={200} height={200} />
                                <h1>{product.name}</h1>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                </div>
                            ))}
                        </div>
            </div>
        </div>
    );
};
export default ProductsView;
import Head from "next/head";
import style from "./products.module.scss";

const ProductsView = () => {
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
            </div>
        </div>
    );
};
export default ProductsView;
import AdminLayout from "@/components/layouts/AdminLayout";
import style from "./Produk.module.scss";
import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { products } from "@/types/products.type";
import converIDR from "@/utils/currency";
import { listenToCollection } from "@/lib/firebase/service";
import ModalAddProduct from "./ModalAddProduct";
import ModalUpdateProduct from "./ModalProductsUpdater";
import ModalDeleteProducts from "./ModalDeleteProducts";

const getStockTotal = (stock: products["stock"]): number => {
  if (Array.isArray(stock)) return stock.reduce((s, x) => s + (Number(x.qty) || 0), 0);
  if (typeof stock === "number") return stock;
  return 0;
};

const ProductAdminView = () => {
  const [updateData, setUpdateData] = useState<Partial<products> | null>(null);
  const [productsData, setProductsData] = useState<products[]>([]);
  const [addProduct, setAddProduct] = useState(false);
  const [deletedProduct, setDeletedProduct] = useState<Partial<products> | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const unsubscribe = listenToCollection("products", (data) => {
      if (Array.isArray(data)) setProductsData(data as products[]);
      else if (data && typeof data === "object") setProductsData([data as products]);
      else setProductsData([]);
    });
    return () => unsubscribe();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    productsData.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [productsData]);

  const filtered = useMemo(() => {
    return productsData.filter((p) => {
      const matchSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [productsData, search, category]);

  const totalProducts = productsData.length;
  const totalStock = productsData.reduce((s, p) => s + getStockTotal(p.stock), 0);
  const lowStock = productsData.filter((p) => {
    const s = getStockTotal(p.stock);
    return s > 0 && s <= 5;
  }).length;
  const outStock = productsData.filter((p) => getStockTotal(p.stock) === 0).length;

  return (
    <>
      <AdminLayout>
        <div className={style.products}>
          <header className={style.products__header}>
            <div>
              <h1 className={style.products__title}>Manajemen Produk</h1>
              <p className={style.products__subtitle}>Kelola katalog, stok, dan harga produk toko</p>
            </div>
            <button className={style.products__addBtn} onClick={() => setAddProduct(true)}>
              <i className="bx bx-plus" /> Tambah Produk
            </button>
          </header>

          <section className={style.products__stats}>
            <div className={style.products__stats__card}>
              <div className={`${style.products__stats__card__icon} ${style["icon--primary"]}`}>
                <i className="bx bx-package" />
              </div>
              <div>
                <p>Total Produk</p>
                <h3>{totalProducts}</h3>
              </div>
            </div>
            <div className={style.products__stats__card}>
              <div className={`${style.products__stats__card__icon} ${style["icon--info"]}`}>
                <i className="bx bx-layer" />
              </div>
              <div>
                <p>Total Stok</p>
                <h3>{totalStock}</h3>
              </div>
            </div>
            <div className={style.products__stats__card}>
              <div className={`${style.products__stats__card__icon} ${style["icon--warning"]}`}>
                <i className="bx bx-error-circle" />
              </div>
              <div>
                <p>Stok Menipis</p>
                <h3>{lowStock}</h3>
              </div>
            </div>
            <div className={style.products__stats__card}>
              <div className={`${style.products__stats__card__icon} ${style["icon--danger"]}`}>
                <i className="bx bx-x-circle" />
              </div>
              <div>
                <p>Stok Habis</p>
                <h3>{outStock}</h3>
              </div>
            </div>
          </section>

          <div className={style.products__toolbar}>
            <div className={style.products__search}>
              <i className="bx bx-search" />
              <input
                type="text"
                placeholder="Cari nama atau kategori produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className={style.products__filter}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className={style.products__tableWrap}>
            <table className={style.products__table}>
              <thead>
                <tr>
                  <th rowSpan={2}>No</th>
                  <th rowSpan={2}>Produk</th>
                  <th rowSpan={2}>Kategori</th>
                  <th rowSpan={2}>Harga</th>
                  <th colSpan={2}>Stok</th>
                  <th rowSpan={2}>Total</th>
                  <th rowSpan={2}>Aksi</th>
                </tr>
                <tr>
                  <th>Size</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className={style.products__empty}>
                      <i className="bx bx-package" />
                      <p>Tidak ada produk ditemukan</p>
                    </td>
                  </tr>
                )}
                {filtered.map((product, index) => {
                  const stockArray = Array.isArray(product.stock) ? product.stock : [];
                  const stockLength = stockArray.length > 0 ? stockArray.length : 1;
                  const totalQty = getStockTotal(product.stock);
                  const stockClass =
                    totalQty === 0
                      ? style["badge--danger"]
                      : totalQty <= 5
                      ? style["badge--warning"]
                      : style["badge--success"];
                  return (
                    <Fragment key={product.id}>
                      <tr>
                        <td rowSpan={stockLength}>{index + 1}</td>
                        <td rowSpan={stockLength}>
                          <div className={style.products__product}>
                            <div className={style.products__product__img}>
                              <Image
                                src={product.image || "/image/deafult.jpg"}
                                alt={product.name}
                                width={56}
                                height={56}
                              />
                            </div>
                            <div className={style.products__product__info}>
                              <p className={style.products__product__name}>{product.name}</p>
                              <p className={style.products__product__desc}>{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td rowSpan={stockLength}>
                          <span className={style.products__cat}>{product.category}</span>
                        </td>
                        <td rowSpan={stockLength} className={style.products__price}>
                          {converIDR(product.price)}
                        </td>
                        <td>{stockArray[0]?.size || "-"}</td>
                        <td>{stockArray[0]?.qty ?? "-"}</td>
                        <td rowSpan={stockLength}>
                          <span className={`${style.products__badge} ${stockClass}`}>
                            {totalQty === 0 ? "Habis" : totalQty}
                          </span>
                        </td>
                        <td rowSpan={stockLength}>
                          <div className={style.products__actions}>
                            <button
                              type="button"
                              className={`${style.products__actions__btn} ${style["btn--edit"]}`}
                              onClick={() => setUpdateData(product)}
                              title="Edit"
                            >
                              <i className="bx bxs-edit" />
                            </button>
                            <button
                              type="button"
                              className={`${style.products__actions__btn} ${style["btn--delete"]}`}
                              onClick={() => setDeletedProduct(product)}
                              title="Hapus"
                            >
                              <i className="bx bxs-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {stockArray.slice(1).map((stock) => (
                        <tr key={stock.size}>
                          <td>{stock.size}</td>
                          <td>{stock.qty}</td>
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
      {updateData && Object.keys(updateData).length > 0 && (
        <ModalUpdateProduct
          updateData={updateData}
          setUpdateData={setUpdateData}
          setProductsData={setProductsData}
        />
      )}
      {addProduct && (
        <ModalAddProduct setAddProduct={setAddProduct} setProductsData={setProductsData} />
      )}
      {deletedProduct && (
        <ModalDeleteProducts
          deletedProduct={deletedProduct}
          setDeletedProduct={setDeletedProduct}
          setProductsData={setProductsData}
        />
      )}
    </>
  );
};

export default ProductAdminView;

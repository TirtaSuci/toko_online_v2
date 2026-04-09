import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import productServices from "@/Services/products";
import userServices from "@/Services/user";
import style from "./Dashboard.module.scss";

type Product = {
  id: string;
  name: string;
  price: number;
  stock?: number | { size: string; qty: number }[];
  image?: string;
  category?: string;
};

type User = {
  id: string;
  fullname?: string;
  email?: string;
  role?: string;
  image?: string;
};

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const getStockTotal = (stock: Product["stock"]): number => {
  if (typeof stock === "number") return stock;
  if (Array.isArray(stock)) return stock.reduce((s, x) => s + (x.qty || 0), 0);
  return 0;
};

const AdminView = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, uRes] = await Promise.all([
          productServices.getAllProducts().catch(() => null),
          userServices.getAllUsers().catch(() => null),
        ]);
        if (pRes?.data?.data) setProducts(pRes.data.data);
        if (uRes?.data?.data) setUsers(uRes.data.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Stats (data asli yang feasible)
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalMembers = users.filter((u) => u.role === "member").length;
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + (p.price || 0) * getStockTotal(p.stock),
    0
  );
  const lowStockProducts = products.filter((p) => {
    const s = getStockTotal(p.stock);
    return s > 0 && s <= 5;
  });
  const outOfStockProducts = products.filter((p) => getStockTotal(p.stock) === 0);

  // Dummy recent orders (placeholder sampai endpoint ready)
  const recentOrders = [
    { id: "ORD-1042", customer: "Budi Santoso", total: 350000, status: "pending", date: "2026-04-08" },
    { id: "ORD-1041", customer: "Siti Nurhaliza", total: 1250000, status: "processing", date: "2026-04-08" },
    { id: "ORD-1040", customer: "Andi Wijaya", total: 480000, status: "shipped", date: "2026-04-07" },
    { id: "ORD-1039", customer: "Dewi Lestari", total: 720000, status: "completed", date: "2026-04-07" },
    { id: "ORD-1038", customer: "Rizky Pratama", total: 195000, status: "cancelled", date: "2026-04-06" },
  ];

  const statusLabel: Record<string, string> = {
    pending: "Menunggu",
    processing: "Diproses",
    shipped: "Dikirim",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

  return (
    <AdminLayout>
      <div className={style.dashboard}>
        <header className={style.dashboard__header}>
          <div>
            <h1 className={style.dashboard__title}>Admin Dashboard</h1>
            <p className={style.dashboard__subtitle}>Ringkasan toko & operasional</p>
          </div>
          <div className={style.dashboard__actions}>
            <button onClick={() => router.push("/admin/products")}>
              <i className="bx bx-plus" /> Tambah Produk
            </button>
            <button onClick={() => router.push("/admin/users")} className={style["btn--ghost"]}>
              <i className="bx bx-user-plus" /> Kelola User
            </button>
          </div>
        </header>

        {/* KPI Cards */}
        <section className={style.dashboard__stats}>
          <div className={style.dashboard__stats__card}>
            <div className={`${style.dashboard__stats__card__icon} ${style["icon--primary"]}`}>
              <i className="bx bx-package" />
            </div>
            <div>
              <p>Total Produk</p>
              <h3>{loading ? "..." : totalProducts}</h3>
            </div>
          </div>
          <div className={style.dashboard__stats__card}>
            <div className={`${style.dashboard__stats__card__icon} ${style["icon--success"]}`}>
              <i className="bx bx-wallet" />
            </div>
            <div>
              <p>Nilai Inventori</p>
              <h3>{loading ? "..." : formatRp(totalInventoryValue)}</h3>
            </div>
          </div>
          <div className={style.dashboard__stats__card}>
            <div className={`${style.dashboard__stats__card__icon} ${style["icon--info"]}`}>
              <i className="bx bx-user" />
            </div>
            <div>
              <p>Total User</p>
              <h3>{loading ? "..." : totalUsers}</h3>
              <span className={style.dashboard__stats__card__hint}>{totalMembers} member</span>
            </div>
          </div>
          <div className={style.dashboard__stats__card}>
            <div className={`${style.dashboard__stats__card__icon} ${style["icon--warning"]}`}>
              <i className="bx bx-error-circle" />
            </div>
            <div>
              <p>Perlu Perhatian</p>
              <h3>{loading ? "..." : lowStockProducts.length + outOfStockProducts.length}</h3>
              <span className={style.dashboard__stats__card__hint}>stok menipis/habis</span>
            </div>
          </div>
        </section>

        {/* Grid: Recent Orders + Low Stock */}
        <section className={style.dashboard__grid}>
          <div className={`${style.dashboard__card} ${style["dashboard__card--wide"]}`}>
            <div className={style.dashboard__card__header}>
              <h2>Pesanan Terbaru</h2>
              <button onClick={() => router.push("/admin/orders")}>Lihat semua</button>
            </div>
            <div className={style.dashboard__table}>
              <div className={style.dashboard__table__head}>
                <span>Order ID</span>
                <span>Customer</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              {recentOrders.map((o) => (
                <div key={o.id} className={style.dashboard__table__row}>
                  <span className={style.dashboard__table__id}>{o.id}</span>
                  <span>{o.customer}</span>
                  <span className={style.dashboard__table__total}>{formatRp(o.total)}</span>
                  <span>
                    <span className={`${style.dashboard__badge} ${style[`badge--${o.status}`]}`}>
                      {statusLabel[o.status]}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <p className={style.dashboard__note}>* Data dummy — menunggu endpoint orders</p>
          </div>

          <div className={style.dashboard__card}>
            <div className={style.dashboard__card__header}>
              <h2>Stok Menipis</h2>
              <button onClick={() => router.push("/admin/products")}>Kelola</button>
            </div>
            {loading ? (
              <p className={style.dashboard__loading}>Memuat...</p>
            ) : lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
              <div className={style.dashboard__empty}>
                <i className="bx bx-check-circle" />
                <p>Semua stok aman</p>
              </div>
            ) : (
              <div className={style.dashboard__lowstock}>
                {[...outOfStockProducts, ...lowStockProducts].slice(0, 6).map((p) => {
                  const s = getStockTotal(p.stock);
                  return (
                    <div key={p.id} className={style.dashboard__lowstock__item}>
                      <div className={style.dashboard__lowstock__item__img}>
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt={p.name} />
                        ) : (
                          <i className="bx bx-image" />
                        )}
                      </div>
                      <div className={style.dashboard__lowstock__item__body}>
                        <p className={style.dashboard__lowstock__item__name}>{p.name}</p>
                        <p className={style.dashboard__lowstock__item__price}>{formatRp(p.price)}</p>
                      </div>
                      <span
                        className={`${style.dashboard__badge} ${
                          s === 0 ? style["badge--cancelled"] : style["badge--pending"]
                        }`}
                      >
                        {s === 0 ? "Habis" : `${s} tersisa`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className={style.dashboard__card}>
          <div className={style.dashboard__card__header}>
            <h2>Akses Cepat</h2>
          </div>
          <div className={style.dashboard__shortcuts}>
            <button onClick={() => router.push("/admin/products")}>
              <i className="bx bx-package" />
              <span>Produk</span>
            </button>
            <button onClick={() => router.push("/admin/users")}>
              <i className="bx bx-group" />
              <span>User</span>
            </button>
            <button onClick={() => router.push("/admin/orders")}>
              <i className="bx bx-receipt" />
              <span>Pesanan</span>
            </button>
            <button onClick={() => router.push("/admin/profile")}>
              <i className="bx bx-cog" />
              <span>Pengaturan</span>
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminView;

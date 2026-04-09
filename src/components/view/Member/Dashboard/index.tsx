import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import UserLayout from "@/components/layouts/UserLayout";
import userServices from "@/Services/user";
import productServices from "@/Services/products";
import style from "./Dashboard.module.scss";

type Profile = {
  fullname?: string;
  email?: string;
  image?: string;
  address?: Array<{
    addressName?: string;
    recipient?: string;
    fullAddress?: string;
    city?: string;
    isMain?: boolean;
  }>;
};

type CartItem = { productId: string; qty: number; size: string };

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
};

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const UserView = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, prodRes] = await Promise.all([
          userServices.getProfile().catch(() => null),
          productServices.getAllProducts().catch(() => null),
        ]);
        if (pRes?.data?.data) {
          setProfile(pRes.data.data);
          setCart(pRes.data.data.carts || []);
        }
        if (prodRes?.data?.data) setProducts(prodRes.data.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const userName = profile.fullname || session?.user?.name || "Pengguna";
  const userImage = profile.image || (session?.user as { image?: string } | undefined)?.image;
  const initial = userName.charAt(0).toUpperCase();

  const cartCount = cart.reduce((sum, c) => sum + (c.qty || 0), 0);
  const cartTotal = cart.reduce((sum, c) => {
    const p = products.find((pr) => pr.id === c.productId);
    return sum + (p?.price || 0) * c.qty;
  }, 0);
  const mainAddress = profile.address?.find((a) => a.isMain) || profile.address?.[0];
  const recommended = products.slice(0, 4);

  return (
    <UserLayout>
      <div className={style.dashboard}>
        {/* Hero */}
        <section className={style.dashboard__hero}>
          <div className={style.dashboard__hero__avatar}>
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userImage} alt={userName} />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <div className={style.dashboard__hero__text}>
            <h1>Halo, {userName}!</h1>
            <p>Selamat datang kembali. Berikut ringkasan akun Anda hari ini.</p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className={style.dashboard__stats}>
          <div className={style.dashboard__stats__card}>
            <div className={`${style.dashboard__stats__card__icon} ${style["icon--primary"]}`}>
              <i className="bx bx-shopping-bag" />
            </div>
            <div>
              <p className={style.dashboard__stats__card__label}>Item di Keranjang</p>
              <h3>{loading ? "..." : cartCount}</h3>
            </div>
          </div>
          <div className={style.dashboard__stats__card}>
            <div className={`${style.dashboard__stats__card__icon} ${style["icon--success"]}`}>
              <i className="bx bx-wallet" />
            </div>
            <div>
              <p className={style.dashboard__stats__card__label}>Total Belanja Keranjang</p>
              <h3>{loading ? "..." : formatRp(cartTotal)}</h3>
            </div>
          </div>
          <div className={style.dashboard__stats__card}>
            <div className={`${style.dashboard__stats__card__icon} ${style["icon--info"]}`}>
              <i className="bx bx-package" />
            </div>
            <div>
              <p className={style.dashboard__stats__card__label}>Pesanan Aktif</p>
              <h3>0</h3>
            </div>
          </div>
          <div className={style.dashboard__stats__card}>
            <div className={`${style.dashboard__stats__card__icon} ${style["icon--warning"]}`}>
              <i className="bx bx-map" />
            </div>
            <div>
              <p className={style.dashboard__stats__card__label}>Alamat Tersimpan</p>
              <h3>{profile.address?.length || 0}</h3>
            </div>
          </div>
        </section>

        {/* Grid: Address + Shortcut */}
        <section className={style.dashboard__grid}>
          <div className={style.dashboard__card}>
            <div className={style.dashboard__card__header}>
              <h2>Alamat Utama</h2>
              <button onClick={() => router.push("/user/profile")}>Kelola</button>
            </div>
            {mainAddress ? (
              <div className={style.dashboard__address}>
                <p className={style.dashboard__address__name}>
                  <i className="bx bx-user" /> {mainAddress.recipient || userName}
                </p>
                <p className={style.dashboard__address__label}>{mainAddress.addressName || "Rumah"}</p>
                <p className={style.dashboard__address__full}>
                  {mainAddress.fullAddress}
                  {mainAddress.city ? `, ${mainAddress.city}` : ""}
                </p>
              </div>
            ) : (
              <div className={style.dashboard__empty}>
                <i className="bx bx-map-pin" />
                <p>Belum ada alamat tersimpan</p>
                <button onClick={() => router.push("/user/profile")}>Tambah Alamat</button>
              </div>
            )}
          </div>

          <div className={style.dashboard__card}>
            <div className={style.dashboard__card__header}>
              <h2>Akses Cepat</h2>
            </div>
            <div className={style.dashboard__shortcuts}>
              <button onClick={() => router.push("/user/profile")}>
                <i className="bx bx-user-circle" />
                <span>Profil</span>
              </button>
              <button onClick={() => router.push("/user/Order")}>
                <i className="bx bx-receipt" />
                <span>Pesanan</span>
              </button>
              <button onClick={() => router.push("/cart")}>
                <i className="bx bx-cart" />
                <span>Keranjang</span>
              </button>
              <button onClick={() => router.push("/products")}>
                <i className="bx bx-store" />
                <span>Belanja</span>
              </button>
            </div>
          </div>
        </section>

        {/* Recommended Products */}
        <section className={style.dashboard__card}>
          <div className={style.dashboard__card__header}>
            <h2>Rekomendasi Untukmu</h2>
            <button onClick={() => router.push("/products")}>Lihat semua</button>
          </div>
          {loading ? (
            <p className={style.dashboard__loading}>Memuat produk...</p>
          ) : recommended.length === 0 ? (
            <p className={style.dashboard__loading}>Belum ada produk.</p>
          ) : (
            <div className={style.dashboard__products}>
              {recommended.map((p) => (
                <div
                  key={p.id}
                  className={style.dashboard__products__item}
                  onClick={() => router.push(`/products/${p.id}`)}
                >
                  <div className={style.dashboard__products__item__img}>
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.name} />
                    ) : (
                      <i className="bx bx-image" />
                    )}
                  </div>
                  <div className={style.dashboard__products__item__body}>
                    <p className={style.dashboard__products__item__name}>{p.name}</p>
                    <p className={style.dashboard__products__item__price}>{formatRp(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </UserLayout>
  );
};

export default UserView;

import DetailProductView from "@/components/view/Products/productsView";
import productServices from "@/Services/products";
import userServices from "@/Services/user";
import { products } from "@/types/products.type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const DetailProductPage = () => {
    const { id } = useRouter().query;
    const [product, setProduct] = useState<products | null>(null);
    const [cart, setCart] = useState([]);
    const session = useSession();

    const getDetailProducts = async (id: string) => {
        const response = await productServices.getDetailProducts(id);
        setProduct(response.data.data);
    };

    const getCart = async () => {
        const response = await userServices.getCart();
        setCart(response.data.data);
    };

    useEffect(() => {
        if (id) getDetailProducts(id as string);
    }, [id]);

    useEffect(() => {
        if (session?.status === "authenticated") {
            getCart();
        }
    }, [session]);

    return (
        <div>
            {product && <DetailProductView product={product} id={id as string} cart={cart} />}
        </div>
    );
};
export default DetailProductPage;
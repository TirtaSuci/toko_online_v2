import DetailProductView from "@/components/view/products/productsView";
import productServices from "@/Services/products";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DetailProductPage = () => {
    const { id } = useRouter().query;
    const [product, setProduct] = useState([]);

    const getDetailProducts = async (id : string) => {
        const response = await productServices.getDetailProducts(id);
        setProduct(response.data.data);
    };

    useEffect(() => {
        getDetailProducts(id as string);
    }, [id]);

    console.log(product);

    return (
        <div>
            <DetailProductView product={product} />
        </div>
    );
};
export default DetailProductPage;
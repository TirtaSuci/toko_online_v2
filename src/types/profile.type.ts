export type ProfileType = {
    fullname?: string;
    email?: string;
    phone?: string;
    image?: string;
    role?: string;
    address?: {
        id: string;
        addressLine: string;
        isMain: boolean;
        reciptien: string;
        phone: string;
    }[];
    carts?: { productId: string; qty: number; size: string }[] | undefined;
};
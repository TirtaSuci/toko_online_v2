import TransactionSuccessView from "@/components/view/Transaction/Success";
import transactionService from "@/Services/transaction";
import { useRouter } from "next/router";
import { useEffect } from "react";

const TransactionPage = () => {
    const router = useRouter();
    const { query, isReady } = router;

    const checkpayment = async (orderId: string) => {
        try {
            await transactionService.updateTransaction(orderId);

            // bersihkan URL setelah diproses
            router.replace("/transaction/success");
        } catch (err) {
            console.error("Update transaction error:", err);
        }
    };

    useEffect(() => {
        if (!isReady) return;

        const orderId = query.order_id as string;

        if (orderId) {
            checkpayment(orderId);
        }
    }, [isReady]);

    return (
        <div>
            <TransactionSuccessView />
        </div>
    );
};

export default TransactionPage;
import instance from "@/lib/axios/instance";

const endpoint = {
    transaction: "/api/transaction",
};

const transactionService = {
    getTransaction: (order_id: string) => instance.get(`${endpoint.transaction}?order_id=${order_id}`),
    generatedTransaction: (data: Record<string, unknown>) => instance.post(endpoint.transaction, data),
    updateTransaction: (order_id: string) => instance.put(`${endpoint.transaction}?order_id=${order_id}`),
}

export default transactionService
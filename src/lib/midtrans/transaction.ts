import snap from "./init";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTransaction = async (params: any, callback: (transaction: { token: string; redirect_url: string }) => void) => {
    snap
        .createTransaction(params)
        .then((transaction: { token: string; redirect_url: string }) =>
            callback(transaction),
        );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTransaction = async (token: string, callback: (transaction: any) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (snap as any).transaction.status(token).then((transaction: any) => callback(transaction));
};

export {
    createTransaction,
    getTransaction,
};

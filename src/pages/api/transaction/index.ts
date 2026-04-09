/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    responseAPIServerError,
    responseAPISuccess,
} from "@/utils/responseAPI";
import type { NextApiRequest, NextApiResponse } from "next";
import { createTransaction, getTransaction } from "@/lib/midtrans/transaction";
import { nanoid } from "nanoid";
import { retriveDataById, updateData } from "@/lib/firebase/service";
import { TokenVerify } from "@/utils/tokenVerify"
import { arrayUnion } from "firebase/firestore";

type Data = {
    status: boolean;
    message: string;
    data: any;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    if (req.method === `GET`) {
        TokenVerify(req, res, false, async (decoded: { id: string }) => {
            if (decoded.id) {
                const order_id = req.query.order_id;
                getTransaction(`${order_id}`, async (result: any) => {
                    if (result) {
                        responseAPISuccess(res, true, 200, "Success", result);
                    } else {
                        responseAPIServerError(res);
                    }
                });
            }
        });
    }
    else if (req.method === `POST`) {
        TokenVerify(req, res, false, async (decoded: { id: string }) => {
            const payload = req.body;
            delete payload.user.address.isMain;
            const order_id = nanoid();
            const params = {
                transaction_details: {
                    order_id: order_id,
                    gross_amount: payload.transaction.total,
                },
                customer_details: {
                    first_name: payload.user.fullname,
                    email: payload.user.email,
                    phone: payload.user.phone,
                    shipping_address: {
                        first_name: payload.user.address.reciptien,
                        phone: payload.user.address.phone,
                        address: payload.user.address.address,
                    },
                },
                item_details: payload.transaction.items
            };
            createTransaction(
                params,
                async (transaction: { token: string; redirect_url: string }) => {
                    const newTransaction = {
                        ...payload.transaction,
                        address: payload.user.address,
                        token: transaction.token,
                        redirect_url: transaction.redirect_url,
                        status: `pending`,
                        order_id: order_id,
                    };

                    const data = {
                        transaction: arrayUnion(newTransaction),
                        //carts : [],
                    };
                    await updateData(`users`, decoded.id, data, (result: boolean) => {
                        if (result) {
                            responseAPISuccess(res, true, 200, "Success", {
                                token: transaction.token,
                                redirect_url: transaction.redirect_url,
                            });
                        } else {
                            responseAPIServerError(res);
                        }
                    });
                },
            );
        });
    }
    else if (req.method === `PUT`) {
        TokenVerify(req, res, false, async (decoded: { id: string }) => {
            if (decoded.id) {
                const order_id = req.query.order_id;
                getTransaction(`${order_id}`, async (result: any) => {
                    const user: any = await retriveDataById(`users`, decoded.id);
                    const index = user.transaction.findIndex((item: any) => item.order_id === order_id);
                    if (index !== -1) {
                        user.transaction[index].status = result.transaction_status;
                    }

                    const data = { transaction: user.transaction };
                    await updateData(`users`, decoded.id, data, (result: boolean) => {
                        if (result) {
                            responseAPISuccess(res, true, 200, "Success", data);
                        } else {
                            responseAPIServerError(res);
                        }
                    });
                });
            }
        });
    }
}

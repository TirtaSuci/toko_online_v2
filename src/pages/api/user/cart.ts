/* eslint-disable @typescript-eslint/no-explicit-any */
import { retriveDataById, updateData } from "@/lib/firebase/service";
import { TokenVerify } from "@/utils/tokenVerify";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        TokenVerify(req, res, false, async (decoded: { id: string }) => {
            if (decoded && decoded.id) {
                const user: any = await retriveDataById("users", decoded.id);
                res.status(200).json({
                    status: true,
                    statusCode: 200,
                    message: "Success",
                    data: user.carts,
                });
            } else {
                res.status(401).json({
                    status: false,
                    statusCode: 401,
                    message: "Unauthorized",
                });
            }
        });
    }
    else if (req.method === "PUT") {
        const { data } = req.body;
        TokenVerify(req, res, false, async (decoded: { id: string }) => {
            if (decoded) {
                await updateData(`users`, decoded.id, data, (result: boolean) => {
                    if (result) {
                        res.status(200).json({
                            status: true,
                            statusCode: 200,
                            message: "Cart updated successfully",
                        });
                    } else {
                        res.status(500).json({
                            status: false,
                            statusCode: 500,
                            message: "Failed to update cart",
                        });
                    }
                });
            }
            else {
                res.status(401).json({
                    status: false,
                    statusCode: 401,
                    message: "Unauthorized",
                });
            }
        });
    }
}
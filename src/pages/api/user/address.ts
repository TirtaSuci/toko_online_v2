import { retriveDataById, updateData } from "@/lib/firebase/service";
import { TokenVerify } from "@/utils/tokenVerify";
import { NextApiRequest, NextApiResponse } from "next";
import { ProfileType } from "@/types/profile.type";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "PUT") {
        const { data } = req.body;
        TokenVerify(req, res, false, async (decoded: { id: string }) => {
            if (decoded) {
                await updateData(`users`, decoded.id, data, (result: boolean) => {
                    if (result) {
                        res.status(200).json({
                            status: true,
                            statusCode: 200,
                            message: "Address updated successfully",
                        });
                    } else {
                        res.status(500).json({
                            status: false,
                            statusCode: 500,
                            message: "Failed to update address",
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
    } else if (req.method === "DELETE") {
        const { address } = req.query;
        TokenVerify(req, res, false, async (decoded: { id: string }) => {
            if (decoded) {
                const user = await retriveDataById("users", decoded.id) as ProfileType | undefined;
                const newAddress = user?.address?.filter((item: { id: string }) => item.id !== address) ?? [];
                await updateData(`users`, decoded.id, { address: newAddress }, (result: boolean) => {
                    if (result) {
                        res.status(200).json({
                            status: true,
                            statusCode: 200,
                            message: "Address deleted successfully",
                        });
                    } else {
                        res.status(500).json({
                            status: false,
                            statusCode: 500,
                            message: "Failed to delete address",
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
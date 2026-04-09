import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export const TokenVerify = (
    req: NextApiRequest,
    res: NextApiResponse,
    isAdmin: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (decoded: any) => void,
) => {
    const token = req.headers.authorization?.split(" ")[1] || "";
    if (token) {
        jwt.verify(
            token,
            process.env.NEXTAUTH_SECRET || "",
            (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        status: false,
                        statusCode: 401,
                        message: "Invalid token",
                    });
                }
                if (decoded && typeof decoded === "object" && (isAdmin ? decoded.role === "admin" : true)) {
                    callback(decoded);
                } else {
                    return res.status(403).json({
                        status: false,
                        statusCode: 403,
                        message: "Forbidden",
                    });
                }
            },
        );
    } else {
        return res.status(401).json({
            status: false,
            statusCode: 401,
            message: "Token not found",
        });
    }
};

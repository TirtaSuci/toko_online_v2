import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.NEXTAUTH_SECRET || "", (err, decoded) => {
        if (decoded) {
          return res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Success",
            data: decoded,
          });
        } else {
          return res.status(401).json({
            status: false,
            statusCode: 401,
            message: "Unauthorized",
          });
        }
      });
    } else {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Token not found",
      });
    }
  }
}

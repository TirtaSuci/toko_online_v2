import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { updateData } from "@/lib/firebase/service";

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
  } else if (req.method === "PUT") {
    const { user }: any = req.query;
    const data = req.body;
    const token = req.headers.authorization?.split(" ")[1] || "";
    jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "",
      async (err: any, decoded: any) => {
        if (decoded) {
          await updateData(`users`, user[0], data, (result: boolean) => {
            if (result) {
              res.status(200).json({
                status: true,
                statusCode: 200,
                message: "Success",
              });
            } else {
              res.status(400).json({
                status: false,
                statusCode: 400,
                message: "Failed",
              });
            }
          });
        } else {
          res.status(403).json({
            status: false,
            statusCode: 403,
            message: "Forbidden",
          });
        }
      }
    );
  }
}

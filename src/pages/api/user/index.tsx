import { deleteData, retriveData, updateData } from "@/lib/firebase/service";
import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { user } from "@/types/user.type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const users = await retriveData("users");
    const data = users.map((u: Partial<user>) => {
      const restObj = { ...(u as Record<string, unknown>) };
      delete (restObj as Record<string, unknown>)["password"];
      // some entries may have confirmPassword, remove if present
      delete (restObj as Record<string, unknown>)["confirmPassword"];
      return restObj as Partial<user>;
    });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Success",
      data,
    });
  } else if (req.method === "PUT") {
    const { user } = req.query as { user?: string };
    const data = req.body;
    const token = req.headers.authorization?.split(" ")[1] || "";
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as
        | JwtPayload
        | string;
      if (typeof decoded !== "string" && decoded.role === "admin") {
        const success = await new Promise<boolean>((resolve) => {
          updateData("users", user || "", data, (result: boolean) =>
            resolve(result)
          );
        });
        if (success) {
          return res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Success",
          });
        }
        return res.status(400).json({
          status: false,
          statusCode: 400,
          message: "Failed",
        });
      }
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Forbidden",
      });
    } catch {
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Forbidden",
      });
    }
  } else if (req.method === "DELETE") {
    const { user } = req.query as { user?: string };
    const token = req.headers.authorization?.split(" ")[1] || "";
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as
        | JwtPayload
        | string;
      if (typeof decoded !== "string" && decoded.role === "admin") {
        const success = await new Promise<boolean>((resolve) => {
          deleteData("users", user || "", (result: boolean) => resolve(result));
        });
        if (success) {
          return res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Success",
          });
        }
        return res.status(400).json({
          status: false,
          statusCode: 400,
          message: "Failed",
        });
      }
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Forbidden",
      });
    } catch {
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Forbidden",
      });
    }
  }
}

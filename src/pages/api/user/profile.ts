import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { updateData, retriveDataById } from "@/lib/firebase/service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as
          | JwtPayload
          | string;
        if (typeof decoded === "string") {
          return res.status(401).json({
            status: false,
            statusCode: 401,
            message: "Unauthorized",
          });
        }

        const userId = decoded.id as string;
        // Fetch full user data from Firestore instead of JWT token
        const profileData = await retriveDataById("users", userId);

        if (!profileData) {
          return res.status(404).json({
            status: false,
            statusCode: 404,
            message: "User not found",
          });
        }

        return res.status(200).json({
          status: true,
          statusCode: 200,
          message: "Success",
          data: {
            id: userId,
            ...profileData,
          },
        });
      } catch {
        return res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Unauthorized",
        });
      }
    } else {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Token not found",
      });
    }
  } else if (req.method === "PUT") {
    const data = req.body;
    const token = req.headers.authorization?.split(" ")[1] || "";
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "") as
        | JwtPayload
        | string;
      if (typeof decoded === "string") {
        return res.status(403).json({
          status: false,
          statusCode: 403,
          message: "Forbidden",
        });
      }

      const userId = decoded.id as string;
      const success = await new Promise<boolean>((resolve) => {
        updateData("users", userId, data, (result: boolean) => {
          resolve(result);
        });
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
    } catch {
      return res.status(403).json({
        status: false,
        statusCode: 403,
        message: "Forbidden",
      });
    }
  }
}

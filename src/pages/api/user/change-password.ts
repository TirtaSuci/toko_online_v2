import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { retriveDataById, updateData } from "@/lib/firebase/service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ status: false, statusCode: 405, message: "Method not allowed" });
  }

  const { userId, oldPassword, newPassword } = req.body as {
    userId?: string;
    oldPassword?: string;
    newPassword?: string;
  };

  if (!userId || !oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ status: false, statusCode: 400, message: "Missing parameters" });
  }

  const token = req.headers.authorization?.split(" ")[1] || "";

  try {
    const decoded: any = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.NEXTAUTH_SECRET || "", (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });

    if (!decoded) {
      return res
        .status(403)
        .json({ status: false, statusCode: 403, message: "Forbidden" });
    }

    // You can enforce that only the user itself (or admin) can change the password
    if (decoded.id !== userId && decoded.role !== "admin") {
      return res
        .status(403)
        .json({ status: false, statusCode: 403, message: "Not allowed" });
    }

    const userData: any = await retriveDataById("users", userId);
    if (!userData) {
      return res
        .status(404)
        .json({ status: false, statusCode: 404, message: "User not found" });
    }

    // verify old password
    const isValid = await bcrypt.compare(oldPassword, userData.password || "");
    if (!isValid) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Old password is incorrect",
      });
    }

    // hash new password and update
    const hashed = await bcrypt.hash(newPassword, 10);
    const result: any = await new Promise((resolve) => {
      updateData(
        "users",
        userId,
        { password: hashed, updatedAt: new Date() },
        (success: boolean) => {
          resolve(success);
        }
      );
    });

    if (result) {
      return res
        .status(200)
        .json({ status: true, statusCode: 200, message: "Password updated" });
    }

    return res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Failed to update password",
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
}

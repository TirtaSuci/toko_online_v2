import type { NextApiRequest, NextApiResponse } from "next";
import { verifyEmailToken } from "@/Services/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, email } = req.query;
  if (!token || !email || typeof token !== "string" || typeof email !== "string") {
    return res.redirect("/auth/login?verified=invalid");
  }

  const result = await verifyEmailToken(email, token);
  if (result.success) {
    return res.redirect("/auth/login?verified=success");
  }
  return res.redirect("/auth/login?verified=failed");
}

import type { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/Services/auth";
import { isAllowedEmailProvider } from "@/utils/emailValidator";
import { sendVerificationEmail } from "@/lib/mailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body || {};
    if (!email || !isAllowedEmailProvider(email)) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message:
          "Email provider tidak diizinkan. Gunakan Gmail, Yahoo, Outlook, iCloud, atau Proton.",
      });
    }
    await signUp(req.body, async (status, message, extra) => {
      if (status && extra?.verificationToken && extra?.email) {
        try {
          await sendVerificationEmail(extra.email, extra.verificationToken);
          res.status(200).json({
            status: true,
            statusCode: 200,
            message:
              "Registrasi berhasil. Silakan cek email Anda untuk verifikasi.",
          });
        } catch {
          res.status(500).json({
            status: false,
            statusCode: 500,
            message:
              "Registrasi berhasil tapi gagal mengirim email verifikasi. Hubungi admin.",
          });
        }
      } else {
        res.status(400).json({
          status: false,
          statusCode: 400,
          message: message || "User registration failed",
        });
      }
    });
  } else {
    res
      .status(405)
      .json({ status: false, statusCode: 405, message: "Method not allowed" });
  }
}

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const link = `${baseUrl}/api/user/verify-email?token=${token}&email=${encodeURIComponent(to)}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
      <h2>Verifikasi Email Anda</h2>
      <p>Terima kasih telah mendaftar. Klik tombol di bawah untuk memverifikasi email Anda. Link ini berlaku selama 24 jam.</p>
      <p style="text-align:center;margin:32px 0">
        <a href="${link}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none">Verifikasi Email</a>
      </p>
      <p style="font-size:12px;color:#666">Jika tombol tidak bekerja, salin link ini:<br/>${link}</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Verifikasi Email - Online Shop",
    html,
  });
}

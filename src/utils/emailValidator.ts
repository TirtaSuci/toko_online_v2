// Daftar domain email penyedia yang diizinkan untuk login/register
export const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.id",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "1.com",
];

export const getEmailDomain = (email: string): string | null => {
  if (!email || typeof email !== "string") return null;
  const parts = email.toLowerCase().trim().split("@");
  if (parts.length !== 2 || !parts[1]) return null;
  return parts[1];
};

export const isAllowedEmailProvider = (email: string): boolean => {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
};

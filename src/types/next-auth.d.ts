import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string | null;
  }

  interface Session {
    user: {
      role?: string | null;
      type?: string;
    } & DefaultSession["user"];
    accessToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    accessToken?: string | null;
  }
}

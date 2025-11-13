import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginWithGoogle, SignIn } from "@/Services/auth";
import { compare } from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: `credentials`,
      name: `Credentials`,
      credentials: {
        email: { label: `email`, type: `email` },
        password: { label: `password`, type: `password` },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user: any = await SignIn(email);
        if (user) {
          const isPasswordValid = await compare(password, user.password);
          if (isPasswordValid) {
            return user;
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, trigger, session }: any) {
      if (account?.provider === "credentials") {
        token.email = user.email;
        token.fullname = user.fullname;
        token.role = user.role;
        token.id = user.id;
        token.image = user.image;
        token.phone = user.phone;
        token.type = `credentials`;
      }

      if (account?.provider === "google") {
        const data = {
          email: user.email,
          fullname: user.name,
          image: user.image,
          type: `google`,
          role: `member`,
          phone: user.phone,
        };
        await loginWithGoogle(data, (data: any) => {
          token.email = data.email;
          token.fullname = data.fullname;
          token.image = data.image;
          token.role = data.role;
          token.id = data.id;
          token.phone = data.phone;
          token.type = `google`;
        });
      }
      // --- 🔹 Tambahan penting: update token saat session.update() dipanggil
      if (trigger === "update" && session?.user) {
        token.fullname = session.user.fullname;
        token.email = session.user.email;
        token.image = session.user.image;
      }

      return token;
    },

    async session({ session, token }: any) {
      if ("email" in token) {
        session.user.email = token.email;
      }
      if ("fullname" in token) {
        session.user.fullname = token.fullname;
      }
      if ("image" in token) {
        session.user.image = token.image;
      }
      if ("role" in token) {
        session.user.role = token.role;
      }
      if ("id" in token) {
        session.user.id = token.id;
      }
      if ("phone" in token) {
        session.user.phone = token.phone;
      }
      if ("type" in token) {
        session.user.type = token.type;
      }

      // Buat accessToken (tidak diubah)
      const accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || "", {
        algorithm: "HS256",
      });
      session.accessToken = accessToken;

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);

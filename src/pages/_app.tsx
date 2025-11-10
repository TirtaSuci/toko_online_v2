import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import Navbar from "@/components/fragment/Navbar";
import Head from "next/head";
import { useRouter } from "next/router";
import Toaster from "@/components/layouts/Toaster";
import React, { useEffect, useState } from "react";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const disableNavbar = [`auth`, `admin`, `user`];

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const [toaster, setToaster] = useState<{
    variant?: "success" | "error" | "info";
    message?: string;
  }>({});
  useEffect(() => {
    if (Object.keys(toaster).length > 0) {
      setTimeout(() => {
        setToaster({});
      }, 3000);
    }
  }, [toaster]);

  return (
    <SessionProvider session={session}>
      <Head>
        <link
          href="https://cdn.boxicons.com/fonts/basic/boxicons.min.css"
          rel="stylesheet"
        ></link>
        <link
          href="https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css"
          rel="stylesheet"
        ></link>
      </Head>
      <div className={roboto.className}>
        {!disableNavbar.includes(router.pathname.split("/")[1]) && <Navbar />}
        <Component {...pageProps} setToaster={setToaster} />
        {Object.keys(toaster || {}).length > 0 && (
          <Toaster
            variant={toaster?.variant}
            message={toaster?.message}
            setToaster={setToaster}
          />
        )}
      </div>
    </SessionProvider>
  );
}

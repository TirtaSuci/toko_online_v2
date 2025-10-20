import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import Navbar from "@/components/layouts/Navbar";
import Head from "next/head";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link
          href="https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css"
          rel="stylesheet"
        ></link>
      </Head>
      <div className={roboto.className}>
        <Navbar></Navbar>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { WalletProvider } from "@/providers";
import { Footer, Navbar } from "@/components";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "@interchain-ui/react/styles";
import "./globals.css";

const josefin_sans = Josefin_Sans({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RugLeopoords - Raffle System",
  description: "Don't force it! You are still getting rugged...hahaha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${josefin_sans.variable} antialiased bg-orange-100`}>
        <NextTopLoader color="dodgerblue" height={4} />

        <WalletProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />

          <ToastContainer position="bottom-right" />
        </WalletProvider>
      </body>
    </html>
  );
}

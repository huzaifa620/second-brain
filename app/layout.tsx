import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EC - Build Your Digital Twin",
  description: "Your second brain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProvider>
      <html lang="en">
        <body className={poppins.className + "h-screen w-full flex flex-col bg-[#00121f] overflow-y-hidden"}>
          <Header />
          {children}
          {/* <Footer /> */}
        </body>
      </html>
    </ClientProvider>
  );
}

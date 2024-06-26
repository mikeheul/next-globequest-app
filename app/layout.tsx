import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Permanent_Marker, Luckiest_Guy } from "next/font/google";
import ToastProvider from "@/components/providers/toaster-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

const permanent = Permanent_Marker({ 
  subsets: ["latin"], 
  weight: "400", 
  style: "normal",
  variable: '--font-permanent',
});

const luckiest = Luckiest_Guy({ 
  subsets: ["latin"], 
  weight: "400", 
  style: "normal",
  variable: '--font-luckiest',
});

export const metadata: Metadata = {
  title: "Globe Quest App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`${inter.variable} ${permanent.variable} ${luckiest.variable} font-normal`}>
      {/* <body className={inter.variable}> */}
        <div className='flex flex-col h-screen'>
          <Navbar />
            <main className='pt-20 flex-grow'>
              <ToastProvider />
              {children}
            </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

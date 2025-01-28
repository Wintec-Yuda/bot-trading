import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProviderWrapper from "@/components/ProviderWrapper";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bot Trading",
  description: "Bot Trading is an automated system that uses algorithms to execute trades in stocks, cryptocurrencies, or other financial instruments without human intervention. By analyzing the market in real-time, the bot makes transactions based on predefined parameters, helping to enhance efficiency and reduce the potential for human error. It's ideal for traders looking to capitalize on market opportunities quickly and consistently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProviderWrapper>
          <Navbar />
          {children}
        </ProviderWrapper>
      </body>
    </html>
  );
}

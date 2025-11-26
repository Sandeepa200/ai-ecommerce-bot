import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MiniFooter from "@/components/MiniFooter";
import { ThemeProvider } from "@/components/ThemeProvider";
import HeaderBar from "@/components/HeaderBar";
import { ClerkProvider } from "@clerk/nextjs";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecom Support Bot",
  description: "E-commerce support for orders, returns, and recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <HeaderBar />
            {children}
            <MiniFooter />
            <ChatWidget />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";
import AppNavbar from "@/components/Navbar";
import FinlyticsHoverLogo from "@/components/FinlyticsHoverLogo";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Finlytics",
  description: "Your AI-powered micro cap stock assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Finlytics Hover Logo</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextUIProvider>
          <AppNavbar />
          {children}
          <Toaster theme="dark" />
        </NextUIProvider>
      </body>
    </html>
  );
}

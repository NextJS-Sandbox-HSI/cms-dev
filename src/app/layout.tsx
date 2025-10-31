import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/atom-one-dark.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSession } from "@/lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DevBlog - Modern Blog Platform",
    template: "%s | DevBlog",
  },
  description: "A modern blog platform built with Next.js, TypeScript, and Prisma. Sharing knowledge, one post at a time.",
  keywords: ["blog", "nextjs", "typescript", "prisma", "web development"],
  authors: [{ name: "DevBlog Team" }],
  creator: "DevBlog",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devblog.example.com",
    title: "DevBlog - Modern Blog Platform",
    description: "A modern blog platform built with Next.js, TypeScript, and Prisma",
    siteName: "DevBlog",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevBlog - Modern Blog Platform",
    description: "A modern blog platform built with Next.js, TypeScript, and Prisma",
    creator: "@devblog",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Navbar
          user={
            session
              ? {
                  email: session.email,
                  name: session.name,
                }
              : null
          }
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

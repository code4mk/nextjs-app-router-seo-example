import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kamal Shop - Your One-Stop Online Store",
    template: "%s | Kamal Shop",
  },
  description:
    "Shop the best deals on electronics, jewelry, clothing and more at Kamal Shop. Quality products at unbeatable prices with fast delivery.",
  keywords: [
    "online shopping",
    "ecommerce",
    "electronics",
    "jewelry",
    "clothing",
    "kamal shop",
  ],
  openGraph: {
    title: "Kamal Shop - Your One-Stop Online Store",
    description:
      "Shop the best deals on electronics, jewelry, clothing and more at Kamal Shop.",
    type: "website",
    siteName: "Kamal Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamal Shop - Your One-Stop Online Store",
    description:
      "Shop the best deals on electronics, jewelry, clothing and more at Kamal Shop.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auction app",
  description: "This is a simple app for hosting auctions for an item.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

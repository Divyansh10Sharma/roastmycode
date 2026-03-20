import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoastMyCode — Brutally Honest Code Reviews",
  description:
    "Paste your GitHub repo or code snippet and get roasted by an AI senior engineer. Real burns. Real fixes.",
  openGraph: {
    title: "RoastMyCode",
    description: "Get your code roasted. Brutally.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}